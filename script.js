// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.scripting.getRegisteredContentScripts()
//     .then(scripts => {
//         document.getElementById('activate').checked = scripts.find(c => c.id == "basic-script") ? true : false;
//     });
// });

// chrome.browserAction.onClicked.addListener(function(tab) {
//     console.log("browser action on clicked called");
//     restore_options();
// });

// document.addEventListener('DOMContentLoaded', function() {
//     console.log("DOM content loaded");
//     restore_options();
// })

// const activate = document.getElementById('activate');
// function restore_options() {
//     chrome.storage.local.get(["basic-script"]).then((result) => {
//         console.log("Value is: ");
//         console.log(result["basic-script"]);
//         console.log(result);
//         activate.checked = result ? true : false;
//     });
//     chrome.storage.local.get(["nonexistent"]).then((result) => {
//         console.log("nonexistent result is: ");
//         console.log(result);
//     });
// }

// ================================================================
// activate.addEventListener('click', () => {
//     if (activate.checked) { register_script(); }
//     else { unregister_script(); }
// });
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