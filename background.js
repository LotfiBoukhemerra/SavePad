// background.js

const activeSite = 'dartpad.dev';
const targetUrl = 'https://dartpad.dev/*';

const activeIcon = {
    16: './icons/icon16.png',
    48: './icons/icon48.png',
    128: './icons/icon128.png'
};
const inactiveIcon = {
    16: './icons/inactive_icon16.png',
    48: './icons/inactive_icon48.png',
    128: './icons/inactive_icon128.png'
};

function updateIcon(tab) {
    // tab && tab.url && tab.id
    if (tab && tab.id) {
        const iconSet = tab.url && tab.url.includes(activeSite) ? activeIcon : inactiveIcon;
        chrome.action.setIcon({ path: iconSet, tabId: tab.id }, () => {
            if (chrome.runtime.lastError) {
                console.warn('Error setting icon:', chrome.runtime.lastError.message);
            }
        });
    } else {
        console.warn('Tab information missing, cannot update icon.');
    }
}

function updateContextMenu(tab) {
    if (tab && tab.url) {
        const isVisible = tab.url.startsWith('https://dartpad.dev');
        chrome.contextMenus.update('save-dart-file', { visible: isVisible }, () => {
            if (chrome.runtime.lastError) {
                console.warn('Error updating context menu:', chrome.runtime.lastError.message);
            }
        });
    }
}

// Remove existing context menu items to avoid duplicates
chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
        id: 'save-dart-file',
        title: 'Save Dart file',
        contexts: ['all'],
        documentUrlPatterns: [targetUrl]
    }, () => {
        if (chrome.runtime.lastError) {
            console.warn('Error creating context menu:', chrome.runtime.lastError.message);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        if (tab) {
            updateContextMenu(tab);
            updateIcon(tab);
        } else {
            console.warn('Tab is undefined in onUpdated listener.');
        }
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.warn('Error getting tab:', chrome.runtime.lastError.message);
            return;
        }
        if (tab) {
            updateContextMenu(tab);
            updateIcon(tab);
        } else {
            console.warn('Tab is undefined in onActivated listener.');
        }
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'save-dart-file' && tab && tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractAndSendContent
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error executing script:', chrome.runtime.lastError.message);
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date) {
        return (
            [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-') +
            '_' +
            [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
            ].join('-')
        );
    }

    if (request.action === 'saveContent') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
                return;
            }

            const tab = tabs[0];
            if (!tab) {
                sendResponse({ success: false, error: 'No active tab found' });
                return;
            }

            const url = new URL(tab.url);

            if (url.hostname === 'dartpad.dev') {
                // Proceed to save content
                const content = request.content.replace(/\u00A0/g, ' ')
                    .split('\n')
                    .map(line => line.replace(/^\d+\s*/, '').trimEnd())
                    .filter(line => line !== '' && line !== '​')
                    .join('\n');

                const blob = new Blob([content], { type: 'application/dart' });
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64data = reader.result;
                    const now = new Date();
                    const dateString = formatDate(now);
                    const filename = `dartpad_${dateString}.dart`;

                    chrome.downloads.download({
                        url: base64data,
                        filename: filename,
                        conflictAction: 'uniquify'
                    }, (downloadId) => {
                        if (chrome.runtime.lastError) {
                            sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        } else {
                            sendResponse({ success: true });
                        }
                    });
                };

                reader.readAsDataURL(blob);
            } else {
                sendResponse({ success: false, error: 'This extension only works on dartpad.dev' });
            }
        });

        return true;
    }
});

function extractAndSendContent() {
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border-radius: 5px;
            z-index: 9999;
            `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    const elements = document.getElementsByClassName('CodeMirror-lines');
    let content = Array.from(elements).map(element => element.innerText).join('\n');

    content = content.replace(/\u00A0/g, ' ')
        .split('\n')
        .map(line => line.replace(/^\d+\s*/, '').trimEnd())
        .filter(line => line !== '' && line !== '​')
        .join('\n');

    chrome.runtime.sendMessage({ action: 'saveContent', content: content }, (response) => {
        if (response.success) {
            showNotification('Content saved successfully!');
        } else {
            showNotification('Failed to save content: ' + response.error);
        }
    });
}