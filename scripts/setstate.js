const len_key = 'length';
const speech_key = 'len_speech';
const brklen_key = 'breaklength';
const length = document.getElementById(len_key);
const len_speech = document.getElementById(speech_key);
const brklen_field = document.getElementById('breaklength');

// Persist options will be done in script.js

const data = await chrome.storage.local.get([len_key, speech_key, brklen_key]);
chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    let url = url_to_code(tabs[0].url);
    length.checked = data[len_key].includes(url);
    len_speech.checked = data[speech_key].includes(url);
    
    brklen_field.value = data[brklen_key];
});

