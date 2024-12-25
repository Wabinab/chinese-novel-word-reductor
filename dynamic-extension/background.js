chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "length",
        js: ["./content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: [ "https://*/*/0/*" ],
        excludeMatches: ["https://*/*/*/end.html"]
    }, {
        id: "len_speech",
        js: ["./content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: [ "https://*/*/0/*" ],
        excludeMatches: ["https://*/*/*/end.html"]
    }, {
        id: "do_nothing",
        js: ["./content_scripts/do_nothing.js"],
        persistAcrossSessions: true,
        matches: ["https://*/*/*/*"],
        excludeMatches: ["https://*/*/0/*", "https://*/*/*/end.html"]  // currently, nothing is excluded. 
    }]).then(() => {
        console.log("oninstalled run (previously not run).");
        chrome.storage.local.set({ "length": [], "len_speech" : [] });
    }).catch((err) => console.warn("unexpected err during registration.", err));

    // set breaklength default to 45.
    chrome.storage.local.set({ "breaklength": 45, "breakspeech": 0 });
});

const len_key = 'length';
const speech_key = 'len_speech';
// const site_key = 'sitename';
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active ) {
        let script = await chrome.scripting.getRegisteredContentScripts();
        let datakeys = await chrome.storage.local.get([len_key, speech_key]);
        if (script.length == 0  
            && (datakeys[len_key].length > 0 || datakeys[speech_key].length > 0)
            // && tab.url.includes(`https://${datakeys[site_key]}/txt`)
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
        matches: datakeys[len_key].map(u => code_to_url(u)),
        excludeMatches: ["https://*/*/*/end.html"]
    }, {
        id: speech_key,
        js: ["./content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: datakeys[speech_key].map(u => code_to_url(u)),
        excludeMatches: ["https://*/*/*/end.html"]
    }, {
        id: "do_nothing",
        js: ["./content_scripts/do_nothing.js"],
        persistAcrossSessions: true,
        matches: ["https://*/*/*/*"],
        excludeMatches: datakeys["length"].concat(datakeys["len_speech"]).map(u => code_to_url(u)).concat(["https://*/*/*/end.html"])
    }]).then(() => {
        console.log("recreated content scripts.");
        // chrome.storage is still saved, otherwise we can't create matches.
    }).catch((err) => console.warn("unexpected err during recreation.", err));
}

function code_to_url(code) {
    return `https://*/*/${code}/*`;
}