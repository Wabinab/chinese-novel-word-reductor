chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        'brklen': 47, 
        'brkspch': 0, 
        'p_spch': 70, 
        'p_len': 50
    });
})