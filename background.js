chrome.runtime.onInstalled.addListener(() => {
    // chrome.scripting.registerContentScripts([{
    //     id: "basic-script",
    //     js: ["content-script.js"],
    //     persistAcrossSessions: true,
    //     matches: ["https://www.69xinshu.com/txt/*"],
    // }])
    // .then(() => { 
    //     console.log("registration complete");
    //     chrome.storage.local.set({ "basic-script": true })
    // })
    // .catch((err) => console.warn("unexpected error during registration", err));

    // Why not set beforehand? Because it wouldn't work for unknown reason.
    chrome.storage.local.set({ "basic-script": false });
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.scripting.getRegisteredContentScripts()
        .then(scripts => {
            if (scripts.find(c => c.id == "basic-script") && tab.url.includes("https://www.69xinshu.com/txt/")) {
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ["content-script.js"]
                });
            }
        });
    }
});