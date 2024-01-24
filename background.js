chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: 'OFF'
    });
  });
  
  const website = "https://www.69xinshu.com/txt/";
  
  // When the user clicks on the extension action
  chrome.action.onClicked.addListener(async (tab) => {
    console.log(tab.url);

    var x = document.getElementsByClassName("txtnav")[0].innerText;
    console.warn(x);
});