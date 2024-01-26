chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "length",
        js: ["./content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => {
        console.log("oninstalled run length (previously not run).");
        chrome.storage.local.set({ "length": [] });
    }).catch((err) => console.warn("unexpected err during registration length.", err));

    chrome.scripting.registerContentScripts([{
        id: "len_speech",
        js: ["./content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => { 
        console.log("oninstalled run len_speech (previously not run).");
        chrome.storage.local.set({ "len_speech" : [] });
    }).catch((err) => console.warn("unexpected error during registration len_speech.", err));
});


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete' && tab.active) {
//         chrome.scripting.getRegisteredContentScripts()
//         .then(scripts => {
//             if (scripts.find(c => c.id == "basic-script")) {
//                 unregister_and_reregister();
//             }
//         });
//     }
// });