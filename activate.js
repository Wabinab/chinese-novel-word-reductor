const match_key = "matches-list";
activate.addEventListener('change', async (event) => {
    var checked = event.target.checked;
    if (checked) { await register_script(filtered_url()); }
    else { await unregister_script(filtered_url()); }
})

async function register_script(url) {
    const start_url = "https://www.69xinshu.com/txt/";
    if (!url.includes(start_url)) {
        console.log("Not 69xinshu.")
        return;
    }

    const data = await chrome.storage.local.get(match_key);
    if (data.includes(url)) {
        console.log("already added.")
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
    //     matches: ["*"],
    // }])
    // .then(() => {
    //     console.log("registration complete");
    //     chrome.storage.local.set({ "basic-script": true })
    // })
    // .catch((err) => console.warn("unexpected error during registration", err));
}

async function unregister_script(url) {
    let data = await chrome.storage.local.get(match_key);
    const idx = data.indexOf(url);
    if (idx == -1) {
        console.log("cannot find index of this url from db.");
        return;
    }
    data = data.splice(idx, 1);

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

function filtered_url() {
    const href = window.location.href;
    var g = href.split('/')
    g.pop();
    g.push('*');
    return g.join('/')
}