let brklen_field = document.getElementById('breaklength');
let brklen_btn = document.getElementById('breaklength_btn');
let brklen_scs = document.getElementById('breaklength_scs');
let brklen_err = document.getElementById('breaklength_err');

brklen_btn.addEventListener('click', async (event) => {
    let brklen_val = brklen_field.value;
    if (brklen_val >= 7 && brklen_val <= 150) {
        console.log("breaklength updated.");
        chrome.storage.local.set({ "breaklength": brklen_val });
        brklen_err.textContent = "";
        brklen_scs.textContent = "Saved.";
        setTimeout(() => { brklen_scs.textContent = ""; }, 1500);
    } else brklen_err.textContent = "length must be between 7 and 150, inclusive.";
});

// ==================================================================
let brkspeech_field = document.getElementById('breakspeech');
let brkspeech_btn = document.getElementById('breakspeech_btn');
let brkspeech_scs = document.getElementById('breakspeech_scs');
let brkspeech_err = document.getElementById('breakspeech_err');

brkspeech_btn.addEventListener('click', async (event) => {
    let brkspeech_val = brkspeech_field.value;
    if (brkspeech_val >= 0 && brkspeech_val <= 150) {
        console.log("breakspeech updated.");
        chrome.storage.local.set({ "breakspeech": brkspeech_val });
        brkspeech_err.textContent = "";
        brkspeech_scs = "Saved.";
        setTimeout(() => { brkspeech_scs.textContent = ""; }, 1500);
    } else brkspeech_err.textContent = "length must be between 0 and 150, inclusive.";
});

// ===================================================================
let site_field = document.getElementById('sitename');
let site_btn = document.getElementById('sitename_btn');
let site_scs = document.getElementById('sitename_scs');
// let site_err = document.getElementById('sitename_err');

site_btn.addEventListener('click', async (event) => {
    let site_val = site_field.value;
    chrome.storage.local.set({ "sitename": site_val });
    site_scs = "Saved."
    setTimeout(() => { site_scs.textContent = ""; }, 1500);
})