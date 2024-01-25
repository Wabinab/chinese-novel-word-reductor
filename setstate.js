const activate = document.getElementById('activate');

// Persist options will be done in script.js

// Initialize with user settings
// const data = await chrome.storage.local.get("basic-script");
// activate.checked = data["basic-script"];

const data = await chrome.storage.local.get("matches-list");
activate.checked = data["matches-list"].includes(filtered_url);


function filtered_url() {
    const href = window.location.href;
    var g = href.split('/')
    g.pop();
    g.push('*');
    return g.join('/')
}