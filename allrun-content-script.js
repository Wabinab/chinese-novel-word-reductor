chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.scripting.getRegisteredContentScripts()
        .then(scripts => {
            if (scripts.find(c => c.id == "basic-script")) {
                unregister_and_reregister();
            }
        });
    }
});

function unregister_and_reregister() {
    chrome.scripting.unregisterContentScripts({ 
        ids: ["basic-script"] 
    })
    .then(() => { 
        chrome.storage.local.set({ "basic-script": false });
        register_script();
    });
}

function register_script() {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => {
        chrome.storage.local.set({ "basic-script": true })
    })
    .catch((err) => console.warn("unexpected error during registration", err));
}