chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([{
        id: "basic-script",
        js: ["content-script.js"],
        persistentAcrossSessions: true,
        matches: ["https://www.69xinshu.com/txt/*"],
    }])
    .then(() => console.log("registration complete"))
    .catch((err) => console.warn("unexpected error during registration", err));

    alert("initialized");
});