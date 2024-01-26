// const match_key = "matches-list";
const length = document.getElementById('length');
const len_speech = document.getElementById('len_speech');

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
        if (checked) { await register_script(url, "length"); }
        else { await unregister_script(url, "length"); }
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
        if (checked) { await register_script(url, "len_speech"); }
        else { await unregister_script(url, "len_speech"); }
    })
}


// ======================================================================
async function register_script(url, key) {
    var scripts = await chrome.scripting.getRegisteredContentScripts()
    if (scripts.length == 0) { 
        onInstalled(); 
        setTimeout(() => register_script(url), 1500);
        return;
    }

    const start_url = "https://www.69xinshu.com/txt/";
    if (!url.includes(start_url)) {
        console.log("Not 69xinshu.", url);
        return;
    }

    let data = await chrome.storage.local.get(key);
    let code = url_to_code(url);
    data = data[key];
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
    }]).then(() => {
        console.log("oninstalled run length (previously not run).");
        chrome.storage.local.set({ "length": [] });
    }).catch((err) => console.warn("unexpected err during registration length.", err));

    chrome.scripting.registerContentScripts([{
        id: "len_speech",
        js: ["../content_scripts/with_speech.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
        excludeMatches: ["https://www.69xinshu.com/txt/*/end.html"]
    }]).then(() => { 
        console.log("oninstalled run len_speech (previously not run).");
        chrome.storage.local.set({ "len_speech" : [] });
    }).catch((err) => console.warn("unexpected error during registration len_speech.", err));

    // set breaklength default to 47.
    chrome.storage.local.set({ "breaklength": 47, "breakspeech": 0 });
}