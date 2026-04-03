// jpxs123.com (jing ping xiao shuo)

var cls_name = "read_chapterDetail"
var maintext = document.getElementsByClassName(cls_name)[0].innerText


document.getElementsByClassName(cls_name)[0].style.backgroundColor = "#ccdfcd";
document.getElementsByClassName(cls_name)[0].style.fontSize = '28px'
document.getElementsByClassName(cls_name)[0].style.lineHeight = '1.7em'

// Have to reload to make changes for this, unfortunately. 
let curr_width = document.getElementsByClassName('topReadContent')[0].getBoundingClientRect().width
if (curr_width >= 1500) document.getElementsByClassName('topReadContent')[0].style.maxWidth = '40%';
else if (curr_width >= 780) document.getElementsByClassName('topReadContent')[0].style.maxWidth = '50%';
else if (curr_width >= 450) document.getElementsByClassName('topReadContent')[0].style.maxWidth = '75%';
// else just retain full width. 

var remnants = maintext.split("\n\n");
chrome.storage.local.get(['breaklength', 'breakspeech']).then((result) => {
  let length = result['breaklength'];
  let speech = result['breakspeech'];

  mergeAllClosers(remnants);
  mergeAllClosers(remnants, "“", "”", "", true);
  mergeAllClosers(remnants, "「", "」", "", true);

  var opener = remnants.filter(x => x.trim().startsWith("【"));
  remnants = remnants.filter(x =>  x.length >= length
    || x.trim().startsWith("【")  && ((opener.length / remnants.length) < 0.4)  // if more than 40%, don't filter;
    || x.trim().startsWith("「")
    || (x.includes("：") && !x.includes("“") && check_right(x))
    || (x.includes('“') && x.length >= speech)
    || (x.includes("……"))
    || (x.includes("第") && x.includes("章"))
  );
  remnants = remnants.filter(onlyUnique);
  // remnants = remnants.map(c =>  c);
  
  var final_html = `<p>${remnants.join('</p><p>')}</p>`;
  document.getElementsByClassName(cls_name)[0].innerHTML = final_html;
});




// =======================================================
// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

// https://stackoverflow.com/questions/20798477/how-to-find-the-indexes-of-all-occurrences-of-an-element-in-array
function mergeAllClosers(remnants, opening="【", closing="】", join_with="<br>", trim=false) {
    var indices = remnants.reduce(function(a, e, i) {
        if (e.trim().includes(closing) && !e.trim().includes(opening)) a.push(i);
        return a;
    }, []);

    var start_indices = [];

    for (var i=0; i < indices.length; i++) {
        var found = false;
        var tracking_index = indices[i];
        while (!found) {
            if (tracking_index < 0) { found = true; start_indices.push(-1); break; }
            if (!remnants[tracking_index].includes(opening)) { tracking_index -= 1; continue; }
            start_indices.push(tracking_index);
            break;
        }
    }

    for (var i=0; i < start_indices.length; i++) {
        if (start_indices[i] == -1) continue;
        var group_this = remnants.slice(start_indices[i], indices[i]+1);
        group_this = group_this.map(c => {
            c = c.replaceAll('\n', '')
            if (trim) c = c.trim();
            return c;
        }).join(join_with);
        remnants[start_indices[i]] = group_this;
        for (var j=start_indices[i]+1; j <= indices[i]; j++) {
            remnants[j] = "";
        }
    }

    return remnants;
}

function percentage(numerator, denominator) {
    return Math.round(numerator / denominator * 100);
}

function check_right(item) {
    var new_item = item.split("：");
    if (new_item.length === 1) return false;
    if (new_item.pop().length === 0) return false;
    return true;
}