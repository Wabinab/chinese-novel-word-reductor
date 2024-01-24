const browser = "https://www.69xinshu.com/txt/";

chrome.runtime.onInstalled.addListener(async (tab) => {
    console.log(tab.url);
    var x = document.getElementsByClassName("txtnav")[0].innerText;
    console.warn(x);
});