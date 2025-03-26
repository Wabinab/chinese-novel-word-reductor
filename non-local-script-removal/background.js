// chrome.webRequest.onBeforeRequest.addListener((details) => {
//   if (!details.url.includes('2wxss.com')) {
//     console.log(`Blocked request to ${details.url}`);
//     return { cancel: true };
//   }
//   return { cancel: false };
// }, { urls: ["<all_urls>"] }, ["blocking"])