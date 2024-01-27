var maintext = document.getElementsByClassName("txtnav")[0].innerText;
var mainhtml = document.getElementsByClassName("txtnav")[0].innerHTML;

// Split by \n\n (double)
var paragraphs = maintext.split("\n\n");
// var first_line = paragraphs[0];

// Some isn't split by \n\n, so we'll solve that. 
var remnants = paragraphs.slice(1, paragraphs.length - 1);
remnants = remnants.map(c => c.split('\n').flat()).flat();
remnants = remnants.filter(c => c != '');  // not empty
var first_line = mainhtml.split(remnants[1])[0];
var last_remnant = remnants[remnants.length-1];
var last_line = mainhtml.split(last_remnant)[1];

// Filter now
chrome.storage.local.get('breaklength').then((length) => {
    length = length['breaklength'];
    remnants = remnants.filter(x =>  x.length >= length 
        || x.trim().startsWith("【")
    );

    if (remnants.length > 0) {
        // Check if first_line contains remnants first. 
        if (first_line.includes(remnants[0].trim().replaceAll('\n', ''))) {
            remnants = remnants.slice(1);
        }
        // Check if last_line contains remnants last.
        if (last_line.includes(remnants[remnants.length-1].trim().replaceAll('\n', ''))) {
            remnants = remnants.slice(0, remnants.length - 1);
        }
    }
    remnants = remnants.map(c => c.trimEnd());

    // Join back
    var final_html = `${first_line}${remnants.join('\n<br><br>\n')}\n<br>\n${last_remnant}\n<br>\n${last_line}`;

    document.getElementsByClassName("txtnav")[0].innerHTML = final_html;
});
