chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.scripting.getRegisteredContentScripts()
    .then(scripts => {
        document.getElementById('activate').checked = scripts.find(c => c.id == "basic-script") ? true : false;
    });
});


const activate = document.getElementById('activate');
activate.addEventListener('click', () => {
    if (activate.checked) { register_script(); }
    else { unregister_script(); }
});

// chrome.tabs.onClicked.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete' && tab.active) {
//         chrome.scripting.getRegisteredContentScripts()
//         .then(scripts => {
//             document.getElementById('activate').checked = scripts.find(c => c.id == "basic-script") ? true : false;
//         });
//     }
// });


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