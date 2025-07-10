// import { extractAndSendContent, showNotification } from './utils.js';

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'extractContent') {
//         extractAndSendContent()
//             .then(() => {
//                 showNotification('Content saved successfully!');
//                 sendResponse({ success: true });
//             })
//             .catch((error) => {
//                 showNotification('Failed to save content: ' + error.message);
//                 sendResponse({ success: false, error: error.message });
//             });
//         return true;
//     }
// });