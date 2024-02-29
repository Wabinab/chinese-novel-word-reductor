let len_key = 'length';
let speech_key = 'len_speech';
let brklen_key = 'breaklength';
let brkspeech_key = 'breakspeech';
let site_key = 'sitename';
let length = document.getElementById(len_key);
let len_speech = document.getElementById(speech_key);
let brklen_field = document.getElementById(brklen_key);
let brkspeech_field = document.getElementById(brkspeech_key);
let site_field = document.getElementById(site_key);

// Persist options will be done in script.js

let data = await chrome.storage.local.get([
    len_key, speech_key, brklen_key, brkspeech_key,
    site_key
]);
chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    let url = url_to_code(tabs[0].url);
    length.checked = data[len_key].includes(url);
    len_speech.checked = data[speech_key].includes(url);
    
    brklen_field.value = data[brklen_key];
    brkspeech_field.value = data[brkspeech_key];
    site_field.value = data[site_key];
});

