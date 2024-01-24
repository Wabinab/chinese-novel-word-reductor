const browser = "https://www.69xinshu.com/txt/";

// chrome.runtime.onInstalled.addListener(async (tab) => {
//     console.log(tab.url);
//     var x = document.getElementsByClassName("txtnav")[0].innerText;
//     console.warn(x);
// });
var x = document.getElementsByClassName("txtnav")[0].innerText;
console.warn(x);

chrome.action.onClicked.addListener(async (tab) => {
    console.log(tab.url);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['action.js']
    });
})