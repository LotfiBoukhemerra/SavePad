// popup.js

function showNotificationError() {
    const notification = document.getElementById('error');
    notification.style.visibility = 'visible';
    setTimeout(() => {
        notification.style.visibility = 'hidden';
    }, 3000);
}

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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error('Error querying tabs:', chrome.runtime.lastError.message);
                showNotificationError();
                return;
            }

            const currentTab = tabs[0];

            if (currentTab && currentTab.url && currentTab.url.startsWith('https://dartpad.dev')) {
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    function: extractAndSendContent
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error executing script:', chrome.runtime.lastError.message);
                        showNotificationError();
                    }
                });
            } else {
                showNotificationError();
            }
        });
    });
});