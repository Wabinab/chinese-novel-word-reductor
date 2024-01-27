chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "length",
        js: ["./content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }, {
        id: "len_speech",
        js: ["./content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => {
        console.log("oninstalled run (previously not run).");
        chrome.storage.local.set({ "length": [], "len_speech" : [] });
    }).catch((err) => console.warn("unexpected err during registration.", err));

    // chrome.scripting.registerContentScripts([{
    //     id: "len_speech",
    //     js: ["./content_scripts/with_speech.js"],
    //     persistAcrossSessions: true,
    //     matches: ["https://www.69xinshu.com/txt/0/*"],
    //     excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    // }]).then(() => { 
    //     console.log("oninstalled run len_speech (previously not run).");
    //     chrome.storage.local.set({ "len_speech" : [] });
    // }).catch((err) => console.warn("unexpected error during registration len_speech.", err));

    // set breaklength default to 47.
    chrome.storage.local.set({ "breaklength": 47, "breakspeech": 0, "sitename": "69xinshu" });
});

const len_key = 'length';
const speech_key = 'len_speech';
const site_key = 'sitename';
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active ) {
        let script = await chrome.scripting.getRegisteredContentScripts();
        let datakeys = await chrome.storage.local.get([len_key, speech_key, site_key]);
        if (script.length == 0  
            && (datakeys[len_key].length > 0 || datakeys[speech_key].length > 0)
            && tab.url.includes(`https://www.${datakeys[site_key]}.com/txt`)
        ) {
            recreate(datakeys);
        }
    }
});

function recreate(datakeys) {
    chrome.scripting.registerContentScripts([{
        id: len_key,
        js: ["./content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: datakeys[len_key].map(u => code_to_url(u, datakeys[site_key])),
        excludeMatches: [`https://www.${datakeys[site_key]}.com/txt/*/end.html`]
    }, {
        id: speech_key,
        js: ["./content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: datakeys[speech_key].map(u => code_to_url(u, datakeys[site_key])),
        excludeMatches: [`https://www.${datakeys[site_key]}.com/txt/*/end.html`]
    }]).then(() => {
        console.log("recreated content scripts.");
        // chrome.storage is still saved, otherwise we can't create matches.
    }).catch((err) => console.warn("unexpected err during recreation.", err));
}

function code_to_url(code, site_key) {
    return `https://www.${site_key}.com/txt/${code}/*`;
}