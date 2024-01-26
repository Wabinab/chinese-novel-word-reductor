let brklen_field = document.getElementById('breaklength');
let brklen_btn = document.getElementById('breaklength_btn');
let brklen_err = document.getElementById('breaklength_err');

brklen_btn.addEventListener('click', async (event) => {
    let brklen_val = brklen_field.value;
    if (brklen_val >= 7 && brklen_val <= 150) {
        console.log("breaklength updated.");
        chrome.storage.local.set({ "breaklength": brklen_val });
        brklen_err.textContent = "";
    } else brklen_err.textContent = "length must be between 7 and 150, inclusive.";
});