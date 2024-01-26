const len_key = 'length';
const speech_key = 'len_speech';
const length = document.getElementById(len_key);
const len_speech = document.getElementById(speech_key);

// Persist options will be done in script.js


const data = await chrome.storage.local.get([len_key, speech_key]);
chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    let url = filtered_url(tabs[0].url);
    length.checked = data[len_key].includes(url);
    len_speech.checked = data[len_speech].includes(url);
});

// function filtered_url(href) {
//     var g = href.split('/')
//     g.pop();
//     g.push('*');
//     return g.join('/')
// }