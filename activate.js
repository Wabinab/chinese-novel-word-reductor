const match_key = "matches-list";
activate.addEventListener('change', async (event) => {
    var checked = event.target.checked;

    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        let url = filtered_url(tabs[0].url);
        if (checked) { await register_script(url); }
        else { await unregister_script(url); }
    });
})

async function register_script(url) {
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

    let data = await chrome.storage.local.get(match_key);
    data = data["matches-list"];
    if (data.includes(url)) {
        console.log("already added before.", data)
        return;
    }
    data.push(url);

    chrome.scripting.updateContentScripts([{
        id: "basic-script",
        matches: data
    }])
    .then(() => {
        console.log("Script updated to include: ");
        console.log(data);
        chrome.storage.local.set({ "matches-list": data });
    })
    .catch((err) => console.warn("unexpected error during registration.", err));


    // chrome.scripting.registerContentScripts([{
    //     id: "basic-script",
    //     js: ["content-script.js"],
    //     persistAcrossSessions: true,
    //     matches: [""],
    // }])
    // .then(() => {
    //     console.log("registration complete");
    //     chrome.storage.local.set({ "basic-script": true })
    // })
    // .catch((err) => console.warn("unexpected error during registration", err));
}

async function unregister_script(url) {
    let data = await chrome.storage.local.get(match_key);
    data = data["matches-list"];
    const idx = data.indexOf(url);
    if (idx == -1) {
        console.log("cannot find index of this url from db.");
        return;
    }
    data.splice(idx, 1);  // splice change in place. DO NOT ASSIGN IT!!!

    // Script must have at least one match, so. 
    if (data.length == 0) {
        data.push("https://www.69xinshu.com/txt/0/*");
    }

    chrome.scripting.updateContentScripts([{
        id: "basic-script", 
        matches: data
    }])
    .then(() => {
        console.log("Script updated to remove, now left: ");
        console.log(data);
        chrome.storage.local.set({ "matches-list": data })
    })
    .catch((err) => console.warn("unexpected error during unregistration.", err));

    // chrome.scripting.unregisterContentScripts({ 
    //     ids: ["basic-script"] 
    // })
    // .then(() => { 
    //     console.log("un-registration complete");
    //     chrome.storage.local.set({ "basic-script": false })
    // });
}

function filtered_url(href) {
    // const href = window.location.href;
    var g = href.split('/')
    g.pop();
    g.push('*');
    return g.join('/')
}


// Just in case onInstalled not running. 
function onInstalled() {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/0/*"],
    }])
    .then(() => { 
        console.log("oninstalled run (previously not run).");
        chrome.storage.local.set({ "matches-list" : [] });
        // chrome.storage.local.set({ "basic-script": true })
    })
    .catch((err) => console.warn("unexpected error during registration", err));
}