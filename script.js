chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistentAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => console.log("registration complete"))
    .catch((err) => console.warn("unexpected error during registration", err));
  });

const activate = document.getElementById('activate');
activate.addEventListener('click', async () => {
    console.log("clicked activate.");
    register_script();
    await chrome.scripting.unregisterContentScripts({ 
        ids: ["basic-script"] 
    })
    .then(() => console.log("un-registration complete"));
});


function register_script() {
    console.log("register script fn called.");
}