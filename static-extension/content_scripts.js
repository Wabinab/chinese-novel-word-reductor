var maintext = document.getElementsByClassName("txtnav")[0].innerText;
var mainhtml = document.getElementsByClassName("txtnav")[0].innerHTML;

var paragraphs = maintext.split("\n\n");

var remnants = paragraphs.slice(1, paragraphs.length - 1);
remnants = remnants.map(c => c.split('\n').flat()).flat();
remnants = remnants.filter(c => c != '');  // not empty

var first_line = mainhtml.split(paragraphs[1].trim())[0];
if (first_line.length > 2000) first_line = mainhtml.split(remnants[1].trim())[0];
if (first_line.length > 2000) first_line = mainhtml.split('\n<br><br>\n')[0] + '\n<br><br>\n';
var last_remnant = remnants[remnants.length-1];
var last_line = mainhtml.split(last_remnant.trim()).pop().replaceAll('\n<br>\n', '');

// ==============================
chrome.storage.local.get(['brklen', 'brkspch', 'p_len', 'p_spch']).then((result) => {
    let brk_len = result['brklen'];
    let brk_spch = result['brkspch'];
    // We limit percentage_len < percentage_spch at all times. 
    let percentage_len = result['p_len'];
    let percentage_spch = result['p_spch'];

    remnants = remnants.map(c => c.trimEnd());
    mergeAllClosers(remnants);

    // Check if length >= brk_len percentage > p_spch, we'll retain none. 
    let type = "none";
    let temp_len = remnants.filter(x => x.length >= brk_len);
    if (Math.round(temp_len.length / remnants.length) > percentage_spch) {
        return;
    }

    // Check if speech too short percentage > p_len. 
    let spch_list = remnants.filter(x =>  x.length >= brk_len
        || x.trim().startsWith("【")
        || (x.includes('“') && x.length >= brk_spch)
    );
    let spch_reach_len = spch_list.filter(x => x.length >= brk_len);
    if (Math.round(spch_reach_len.length / spch_list.length) > percentage_len) {
        type = "speech";
    } else {
        type = "length";
    }

    if (type != "none") {
        if (type == "speech") remnants = spch_list;
        if (type == "length") {
            remnants = remnants.filter(x =>  x.length >= length 
                || x.trim().startsWith("【")
            );
        }
        remnants = remnants.filter(onlyUnique);
        // Check if first_line contains remnants first. 
        if (remnants.length > 0 && first_line.includes(remnants[0].trim().replaceAll('\n', ''))) {
            remnants = remnants.slice(1);
        }
        // Check if last_line contains remnants last.
        if (remnants.length > 0 && last_line.includes(remnants[remnants.length-1].trim().replaceAll('\n', ''))) {
            remnants = remnants.slice(0, remnants.length - 1);
        }
        // Check if last_remnant equals remnants last. 
        if (remnants.length > 0 && last_remnant.includes(remnants[remnants.length-1].trim().replaceAll('\n', ''))) {
            remnants = remnants.slice(0, remnants.length - 1);
        }
    
        // Join back
        var final_html = `${first_line.trimEnd()}${remnants.join('\n<br><br>\n')}\n<br>\n${last_remnant}\n<br>\n${last_line}`;
    
        document.getElementsByClassName("txtnav")[0].innerHTML = final_html;
    }
})