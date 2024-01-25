const activate = document.getElementById('activate');
activate.addEventListener('click', () => {
    if (activate.checked) { register_script(); }
    else { unregister_script(); }
});


function register_script() {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => console.log("registration complete"))
    .catch((err) => console.warn("unexpected error during registration", err));
}

function unregister_script() {
    chrome.scripting.unregisterContentScripts({ 
        ids: ["basic-script"] 
    })
    .then(() => console.log("un-registration complete"));
}