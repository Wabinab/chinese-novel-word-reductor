const scripts = document.querySelectorAll("script");
scripts.forEach(s => {
	if (s.src.includes('ads') || s.src.includes('otherad') || s.src.includes('ad.js')) {
		s.remove();
	}
});
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.removeAttribute('target');
});
let txtcenter = document.getElementsByClassName('txtcenter');
let txtcenter_len = txtcenter.length
for (let i = 0; i < txtcenter_len; i++) {
    txtcenter[0].remove()  // remove modify the array length. 
}


let cls_name = "txtnav"
try {
    var maintext = document.getElementsByClassName(cls_name)[0].innerText;
} catch {
    cls_name = "txtbox";
    var maintext = document.getElementsByClassName(cls_name)[0].innerText;
}
var mainhtml = document.getElementsByClassName(cls_name)[0].innerHTML;
document.getElementsByClassName(cls_name)[0].style.lineHeight = '2em'

var paragraphs = maintext.split("\n\n");

var remnants = paragraphs.slice(1, paragraphs.length - 1);
remnants = remnants.map(c => c.split('\n').flat()).flat();
remnants = remnants.filter(c => c != '');  // not empty

var g = mainhtml.split("</h1>");
var h1 = g[0] + '</h1>';
mainhtml = g[1];
var first_line = mainhtml.split(paragraphs[1].trim())[0];
if (first_line.length > 2000) first_line = mainhtml.split(remnants[1].trim())[0];
if (first_line.length > 2000) first_line = mainhtml.split('\n<br><br>\n')[0] + '\n<br><br>\n';
first_line = first_line.split("如果您使用第三方小说APP或各种浏览器插件打开此网站可能导致内容显示乱序,请稍后尝试使用主流浏览器访问此网站，感谢您的支持!")[0];
var last_remnant = remnants[remnants.length-1];
var last_line = mainhtml.split(last_remnant.trim()).pop()
.split('<br>').filter(e => e.trim() != '').join('<br><br>')
    .replaceAll('</p>', '<br>');
//   .replaceAll('\n<br>\n', '');
first_line = first_line.replaceAll('<p>', '<br><br>&emsp;&emsp;');

// ==============================
chrome.storage.local.get(['brklen', 'brkspch', 'p_len', 'p_spch']).then((result) => {
    let brk_len = result['brklen'];
    let brk_spch = result['brkspch'];
    // We limit percentage_len < percentage_spch at all times. 
    let percentage_len = result['p_len'];
    let percentage_spch = result['p_spch'];

    remnants = remnants.map(c => c.trimEnd())
            .filter(x => !x.includes("无错版本"))
            .filter(x => !x.includes("最新章节"));
    mergeAllClosers(remnants);
    mergeAllClosers(remnants, "“", "”", "", true);
    mergeAllClosers(remnants, "「", "」", "", true);

    // Check if length >= brk_len percentage > p_spch, we'll retain none. 
    let type = "none";
    let temp_len = remnants.filter(x => x.length >= brk_len);
    if (percentage(temp_len.length, remnants.length) > percentage_spch) {
        // mainhtml = mainhtml.replaceAll('</p>\n', '</p>\n<br>')
        // document.getElementsByClassName(cls_name)[0].innerHTML = mainhtml;
        document.getElementsByClassName(cls_name)[0].style.lineHeight = '2em'
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

    if (type != "none") {
        if (type == "speech") remnants = spch_list;
        if (type == "length") {
            opener = remnants.filter(x => x.trim().startsWith("【"));
            remnants = remnants.filter(x =>  x.length >= brk_len 
                || x.trim().startsWith("【") && ((opener.length / remnants.length) < 0.4)  // if more than 40%, don't filter;
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
        var final_html = `${h1}${first_line.trimEnd()}${remnants.join('\n<br><br>&emsp;&emsp;\n')}\n<br>\n${last_remnant}\n<br>\n${last_line}`;
    
        document.getElementsByClassName(cls_name)[0].innerHTML = final_html;
    }
})


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