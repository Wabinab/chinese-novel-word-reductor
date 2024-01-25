activate.addEventListener('change', (event) => {
    var checked = event.target.checked;
    if (checked) { register_script(); }
    else { unregister_script(); }
})

function register_script() {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => {
        console.log("registration complete");
        chrome.storage.local.set({ "basic-script": true })
    })
    .catch((err) => console.warn("unexpected error during registration", err));
}

function unregister_script() {
    chrome.scripting.unregisterContentScripts({ 
        ids: ["basic-script"] 
    })
    .then(() => { 
        console.log("un-registration complete");
        chrome.storage.local.set({ "basic-script": false })
    });
}