let brklen_field = document.getElementById('brklen');
let brklen_btn = document.getElementById('brklen_btn');
let brklen_scs = document.getElementById('brklen_scs');
let brklen_err = document.getElementById('brklen_err');

brklen_btn.addEventListener('click', async (event) => {
    let brklen_val = brklen_field.value;
    if (brklen_val >= 7 && brklen_val <= 150) {
        console.log("brklen updated.");
        chrome.storage.local.set({ "brklen": brklen_val });
        brklen_err.textContent = "";
        brklen_scs.textContent = "Saved.";
        setTimeout(() => { brklen_scs.textContent = ""; }, 1500);
    } else brklen_err.textContent = "length must be between 7 and 150, inclusive.";
});

// ==================================================================
let brkspch_field = document.getElementById('brkspch');
let brkspch_btn = document.getElementById('brkspch_btn');
let brkspch_scs = document.getElementById('brkspch_scs');
let brkspch_err = document.getElementById('brkspch_err');

brkspch_btn.addEventListener('click', async (event) => {
    let brkspch_val = brkspch_field.value;
    if (brkspch_val >= 0 && brkspch_val <= 150) {
        console.log("brkspch updated.");
        chrome.storage.local.set({ "brkspch": brkspch_val });
        brkspch_err.textContent = "";
        brkspch_scs = "Saved.";
        setTimeout(() => { brkspch_scs.textContent = ""; }, 1500);
    } else brkspch_err.textContent = "length must be between 0 and 150, inclusive.";
});

// ===================================================================
let p_spch_field = document.getElementById('p_spch');
let p_spch_btn = document.getElementById('p_spch_btn');
let p_spch_scs = document.getElementById('p_spch_scs');
let p_spch_err = document.getElementById('p_spch_err');

p_spch_btn.addEventListener('click', async (event) => {
    let p_spch_val = p_spch_field.value;
    if (p_spch_val > 0 && p_spch_val <= 100) {
        console.log("p_spch updated.");
        chrome.storage.local.set({ "p_spch": p_spch_val });
        p_spch_err.textContent = "";
        p_spch_scs = "Saved.";
        setTimeout(() => { p_spch_scs.textContent = ""; }, 1500);
    } else if (p_spch_val == 0) {
        p_spch_err.textContent = "0% not allowed. Minimum 1%.";
    } else p_spch_err.textContent = "Percentage must be between 1% and 100% inclusive."
});

// ===================================================================
let p_len_field = document.getElementById('p_len');
let p_len_btn = document.getElementById('p_len_btn');
let p_len_scs = document.getElementById('p_len_scs');
let p_len_err = document.getElementById('p_len_err');

p_len_btn.addEventListener('click', async (event) => {
    let p_len_val = p_len_field.value;
    if (p_len_val > 0 && p_len_val <= 100) {
        console.log("p_len updated.");
        chrome.storage.local.set({ "p_len": p_len_val });
        p_len_err.textContent = "";
        p_len_scs = "Saved.";
        setTimeout(() => { p_len_scs.textContent = ""; }, 1500);
    } else if (p_len_val == 0) {
        p_len_err.textContent = "0% not allowed. Minimum 1%.";
    } else p_len_err.textContent = "Percentage must be between 1% and 100% inclusive."
});