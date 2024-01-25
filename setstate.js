const options = {};
const activate = document.getElementById('activate');

// Persist options will be done in script.js

// Initialize with user settings
const data = await chrome.storage.local.get("basic-script");
activate.checked = data["basic-script"];
// Object.assign(options, data["basic-script"]);
// activate.checked = Boolean(options.basic-script);