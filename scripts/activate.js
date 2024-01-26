const len_key = 'length';
const speech_key = 'len_speech';
const length = document.getElementById(len_key);
const len_speech = document.getElementById(speech_key);

length.addEventListener('change', async (event) => {
    if (len_speech.checked) {
        len_speech.checked = false;
        on_lenspeech_change(false);
    }

    on_len_change(event.target.checked);
})

function on_len_change(checked) {
    // var checked = length.checked;
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        let url = filtered_url(tabs[0].url);
        if (checked) { await register_script(url, len_key); }
        else { await unregister_script(url, len_key); }
    });
}

len_speech.addEventListener('change', async (event) => {
    if (length.checked) {
        length.checked = false;
        on_len_change(false);
    }

    on_lenspeech_change(event.target.checked);
});

function on_lenspeech_change(checked) {
    // var checked = len_speech.checked;
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        let url = filtered_url(tabs[0].url);
        if (checked) { await register_script(url, speech_key); }
        else { await unregister_script(url, speech_key); }
    })
}


// ======================================================================
async function register_script(url, key) {
    var scripts = await chrome.scripting.getRegisteredContentScripts()
    let datakeys = await chrome.storage.local.get([len_key, speech_key]);
    if (scripts.length == 0) { 
        if (datakeys[len_key].length == 0 && datakeys[speech_key].length == 0) {
            onInstalled(); 
            setTimeout(() => register_script(url), 1500);
            return;
        }

        // Else, we should be initialize with special. 
        recreate(datakeys);
        setTimeout(() => register_script(url), 1500);
        return;
    }

    const start_url = "https://www.69xinshu.com/txt/";
    if (!url.includes(start_url)) {
        console.log("Not 69xinshu.", url);
        return;
    }

    // let data = await chrome.storage.local.get(key);
    let code = url_to_code(url);
    data = datakeys[key];
    if (data.includes(code)) {
        console.log("already added before.", data)
        return;
    }
    data.push(code);
    
    var dict = {};
    dict[key] = data;

    chrome.scripting.updateContentScripts([{
        id: key,
        matches: data.map(u => code_to_url(u))
    }])
    .then(() => {
        console.log("Added website to", key);
        chrome.storage.local.set(dict);
    })
    .catch((err) => console.warn("unexpected error during registration.", err));
}

async function unregister_script(url, key) {
    let data = await chrome.storage.local.get(key);
    data = data[key];
    let code = url_to_code(url);
    const idx = data.indexOf(code);
    if (idx == -1) {
        console.log("cannot find index of this url from db.");
        return;
    }
    data.splice(idx, 1);  // splice change in place. DO NOT ASSIGN IT!!!

    // Script must have at least one match, so. 
    if (data.length == 0) data.push("0");

    var dict = {};
    dict[key] = data;

    chrome.scripting.updateContentScripts([{
        id: key, 
        matches: data.map(u => code_to_url(u))
    }])
    .then(() => {
        console.log("Removed website from", key);
        chrome.storage.local.set(dict);
    })
    .catch((err) => console.warn("unexpected error during unregistration.", err));
}

// ====================================================
function filtered_url(href) {
    var g = href.split('/')
    g.pop();
    g.push('*');
    return g.join('/')
}

// Change url to save only the book code.
function url_to_code(href) {
    var g = href.split('/');
    return g[4];
}

// Use code to url to reverse this. 
function code_to_url(code) {
    return `https://www.69xinshu.com/txt/${code}/*`;
}


// Just in case onInstalled not running. 
function onInstalled() {
    chrome.scripting.registerContentScripts([{
        id: "length",
        js: ["../content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }, {
        id: "len_speech",
        js: ["../content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => {
        console.log("oninstalled run (previously not run).");
        chrome.storage.local.set({ "length": [], "len_speech": [] });
    }).catch((err) => console.warn("unexpected err during registration.", err));

    // chrome.scripting.registerContentScripts([{
    //     id: "len_speech",
    //     js: ["../content_scripts/with_speech.js"],
    //     persistAcrossSessions: true,
    //     matches: ["https://www.69xinshu.com/txt/0/*"],
    //     excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    // }]).then(() => { 
    //     console.log("oninstalled run len_speech (previously not run).");
    //     chrome.storage.local.set({ "len_speech" : [] });
    // }).catch((err) => console.warn("unexpected error during registration len_speech.", err));

    // set breaklength default to 47.
    chrome.storage.local.set({ "breaklength": 47, "breakspeech": 0 });
}


// re-create content script (usually after restart computer they're lost in Brave browser)
function recreate(datakeys) {
    chrome.scripting.registerContentScripts([{
        id: "length",
        js: ["../content_scripts/length_only.js"],
        persistAcrossSessions: true,
        matches: datakeys["length"].map(u => code_to_url(u)),
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }, {
        id: "len_speech",
        js: ["../content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: datakeys["len_speech"].map(u => code_to_url(u)),
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => {
        console.log("recreate content scripts.");
        // chrome.storage is still saved, otherwise we can't create matches.
    }).catch((err) => console.warn("unexpected err during recreation.", err));
}