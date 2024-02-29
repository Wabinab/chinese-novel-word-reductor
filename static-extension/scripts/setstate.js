let [brklen_key, brkspch_key, p_spch_key, p_len_key] = ['brklen', 'brkspch', 'p_spch', 'p_len'];
let brklen_field = document.getElementById(brklen_key);
let brkspch_field = document.getElementById(brkspch_key);
let p_spch_field = document.getElementById(p_spch_key);
let p_len_field = document.getElementById(p_len_key);

let datakeys = await chrome.storage.local.get([
    brklen_key, brkspch_key, p_spch_key, p_len_key
]);
brklen_field.value = datakeys[brklen_key];
brkspch_field.value = datakeys[brkspch_key];
p_spch_field.value = datakeys[p_spch_key];
p_len_field = datakeys[p_len_key];