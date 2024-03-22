var maintext = document.getElementsByClassName("txtnav")[0].innerText;
var mainhtml = document.getElementsByClassName("txtnav")[0].innerHTML;

// Split by \n\n (double)
var paragraphs = maintext.split("\n\n");

// Some isn't split by \n\n, so we'll solve that. 
var remnants = paragraphs.slice(1, paragraphs.length - 1);
remnants = remnants.map(c => c.split('\n').flat()).flat();
remnants = remnants.filter(c => c != '');  // not empty

var first_line = mainhtml.split(paragraphs[1].trim())[0];
if (first_line.length > 2000) first_line = mainhtml.split(remnants[1].trim())[0];
if (first_line.length > 2000) first_line = mainhtml.split('\n<br><br>\n')[0] + '\n<br><br>\n';
var last_remnant = remnants[remnants.length-1];
var last_line = mainhtml.split(last_remnant.trim()).pop().replaceAll('\n<br>\n', '');

// Filter now
chrome.storage.local.get('breaklength').then((length) => {
    length = length['breaklength'];
    remnants = remnants.map(c => c.trimEnd());
    mergeAllClosers(remnants);
    remnants = remnants.filter(x =>  x.length >= length 
        || x.trim().startsWith("【")
        || x.includes("：")
    );
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
});


// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

// https://stackoverflow.com/questions/20798477/how-to-find-the-indexes-of-all-occurrences-of-an-element-in-array
function mergeAllClosers(remnants) {
    var indices = remnants.reduce(function(a, e, i) {
        if (e.trim().includes("】") && !e.trim().includes("【")) a.push(i);
        return a;
    }, []);

    var start_indices = [];

    for (var i=0; i < indices.length; i++) {
        var found = false;
        var tracking_index = indices[i];
        while (!found) {
            if (tracking_index < 0) { found = true; start_indices.push(-1); break; }
            if (!remnants[tracking_index].includes("【")) { tracking_index -= 1; continue; }
            start_indices.push(tracking_index);
            break;
        }
    }

    for (var i=0; i < start_indices.length; i++) {
        if (start_indices[i] == -1) continue;
        var group_this = remnants.slice(start_indices[i], indices[i]+1);
        group_this = group_this.map(c => c.replaceAll('\n', '')).join('<br>');
        remnants[start_indices[i]] = group_this;
        for (var j=start_indices[i]+1; j <= indices[i]; j++) {
            remnants[j] = "";
        }
    }

    return remnants;
}