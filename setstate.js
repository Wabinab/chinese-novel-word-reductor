const activate = document.getElementById('activate');

// Persist options will be done in script.js

// Initialize with user settings
// const data = await chrome.storage.local.get("basic-script");
// activate.checked = data["basic-script"];

const data = await chrome.storage.local.get("matches-list");
chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    let url = filtered_url(tabs[0].url);
    activate.checked = data["matches-list"].includes(url);
});

function filtered_url(href) {
    var g = href.split('/')
    g.pop();
    g.push('*');
    return g.join('/')
}