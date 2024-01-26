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

    // set breaklength default to 47.
    chrome.storage.local.set({ "breaklength": 47, "breakspeech": 0 });
});

const len_key = 'length';
const speech_key = 'len_speech';
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        let script = await chrome.scripting.getRegisteredContentScripts();
        let datakeys = await chrome.storage.local.get([len_key, speech_key]);
        if (script.length == 0 && 
            (datakeys[len_key].length > 0 || datakeys[speech_key].length > 0)
        ) {
            recreate(datakeys);
        }
    }
});

function recreate(datakeys) {
    chrome.scripting.registerContentScripts([{
        id: "length",
        js: ["./content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: datakeys["length"].map(u => code_to_url(u)),
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }, {
        id: "len_speech",
        js: ["./content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: datakeys["len_speech"].map(u => code_to_url(u)),
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => {
        console.log("recreated content scripts.");
        // chrome.storage is still saved, otherwise we can't create matches.
    }).catch((err) => console.warn("unexpected err during recreation.", err));
}

function code_to_url(code) {
    return `https://www.69xinshu.com/txt/${code}/*`;
}