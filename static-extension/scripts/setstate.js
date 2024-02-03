const [brklen_key, brkspch_key, p_spch_key, p_len_key] = ['brklen', 'brkspch', 'p_spch', 'p_len'];
const brklen_field = document.getElementById(brklen_key);
const brkspch_field = document.getElementById(brkspch_key);
const p_spch_field = document.getElementById(p_spch_key);
const p_len_field = document.getElementById(p_len_key);

const datakeys = await chrome.storage.local.get([
    brklen_key, brkspch_key, p_spch_key, p_len_key
]);
brklen_field.value = datakeys[brklen_key];
brkspch_field.value = datakeys[brkspch_key];
p_spch_field.value = datakeys[p_spch_key];
p_len_field = datakeys[p_len_key];