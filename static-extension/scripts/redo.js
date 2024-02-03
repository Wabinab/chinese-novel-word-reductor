let redo_btn = document.getElementById('redo_again');

chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    let tabId = tabs[0].id

    redo_btn.addEventListener('click', async (event) => {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["./content_scripts.js"]
        }).then(() => console.log("script executed one more time."));
    });
});