const activate = document.getElementById('activate');
activate.addEventListener('click', async () => {
    console.log("Checked: ", activate.checked);
    await chrome.scripting.unregisterContentScripts({ 
        ids: ["basic-script"] 
    })
    .then(() => console.log("un-registration complete"));
});


function register_script() {
    console.log("register script fn called.");
}