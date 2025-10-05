let articles = document.getElementsByTagName('article');
let maintext = articles[articles.length - 1].innerText;
let paragraphs = maintext.split("\n\n");
let remnants = paragraphs.map(c => c.split('\n').flat()).flat();
remnants = remnants.filter(c => c != '');  // not empty
document.getElementsByTagName('article')[articles.length - 1].style.fontSize = '32px';

chrome.storage.local.get(['brklen1', 'brkspch1', 'p_len1', 'p_spch1']).then((result) => {
  let brk_len = result['brklen1'];
  let brk_spch = result['brkspch1'];
  // We limit percentage_len < percentage_spch at all times. 
  let percentage_len = result['p_len1'];
  let percentage_spch = result['p_spch1'];

  remnants = remnants.map(c => c.trimEnd());
  mergeAllClosers(remnants);
  mergeAllClosers(remnants, "“", "”", "", true);
  mergeAllClosers(remnants, "「", "」", "", true);
  let type = "none";
  let temp_len = remnants.filter(x => x.length >= brk_len);
  if (percentage(temp_len.length, remnants.length) > percentage_spch) {
    return;
  }

  // Check if speech too short percentage > p_len. 
  var opener = remnants.filter(x => x.trim().startsWith("【"));
  let spch_list = remnants.filter(x =>  x.length >= brk_len
      || x.trim().startsWith("【") && ((opener.length / remnants.length) < 0.4)  // if more than 40%, don't filter;
      || x.trim().startsWith("「")
      || (x.includes("：") && !x.includes("“") && check_right(x))
      || (x.includes('“') && x.length >= brk_spch)
  );
  let spch_reach_len = spch_list.filter(x => x.length >= brk_len);
  if (percentage(spch_reach_len.length, spch_list.length) > percentage_len) {
      type = "speech";
  } else {
      type = "length";
  }

  if (type == 'none') return;
  if (type == "speech") remnants = spch_list;
  if (type == "length") {
      opener = remnants.filter(x => x.trim().startsWith("【"));
      remnants = remnants.filter(x =>  x.length >= brk_len 
          || x.trim().startsWith("【") && ((opener.length / remnants.length) < 0.4)  // if more than 40%, don't filter;
      );
  }
  remnants = remnants.filter(onlyUnique);

  var final_html = `<p class="cntCls">${remnants.join('</p><p class="cntCls">')}</p>`;
  document.getElementsByTagName('article')[articles.length - 1].innerHTML = final_html;
});


// ======================================
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