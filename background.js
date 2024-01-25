chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => { 
        console.log("registration complete");
        chrome.storage.local.set({ "basic-script": true })
    })
    .catch((err) => console.warn("unexpected error during registration", err));
});


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete' && tab.active) {
//         console.log("on update called");
//         // chrome.scripting.getRegisteredContentScripts()
//         // .then(scripts => {
//         //     document.getElementById('activate').checked = scripts.find(c => c.id == "basic-script") ? true : false;
//         // });
//     }
// });