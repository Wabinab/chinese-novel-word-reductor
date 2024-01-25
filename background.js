chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => console.log("registration complete"))
    .catch((err) => console.warn("unexpected error during registration", err));

    const listScript = [];
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.scripting.getRegisteredContentScripts()
        .then(scripts => {
            console.log("Registered scripts: ");
            console.log(scripts);
        });
        
        listScript.push(tabId);
        console.log(listScript);
    }
});