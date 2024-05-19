const len_key = 'length';
const speech_key = 'len_speech';
let filename = '';
let redo_btn = document.getElementById('redo_again');
let reset_btn = document.getElementById('reset');

let datakeys = await chrome.storage.local.get([len_key, speech_key]);
chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    let url = url_to_code(tabs[0].url);
    let tabId = tabs[0].id
    if (datakeys[len_key].includes(url)) filename = "./content_scripts/length_only.js";
    else if (datakeys[speech_key].includes(url)) filename = "./content_scripts/with_speech.js";

    redo_btn.addEventListener('click', async (event) => {
        if (filename != '') {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: [filename]
            }).then(() => console.log("script executed one more time."));
        } else console.log("filename not defined. You didn't activate any?");
    });
   
    reset_btn.addEventListener('click', async (event) => {
        console.log('restarting.');
        restart(datakeys);
    });
});