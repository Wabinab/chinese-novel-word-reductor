var hosts = ["69shu", "69shuba", "69xinshu", "69yuedu", "twkan"]
if (hosts.filter(h => window.location.host.includes(h)).length > 0) {
  let cls_name = "txtnav"
  try {
      var maintext = document.getElementsByClassName(cls_name)[0].innerText;
  } catch {
      cls_name = "txtbox";
      var maintext = document.getElementsByClassName(cls_name)[0].innerText;
  }
  var mainhtml = document.getElementsByClassName(cls_name)[0].innerHTML;
  document.getElementsByClassName(cls_name)[0].style.lineHeight = '2em'

  // Split by \n\n (double)
  var paragraphs = maintext.split("\n\n");
  // var first_line = paragraphs[0];

  // Some isn't split by \n\n, so we'll solve that. 
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
	first_line = first_line.replaceAll('<p>', '<br><br>&emsp;&emsp;&emsp;&emsp;');

	// Filter now
	// We'll allow length definition later. 
  // For now, let's fix it to 50.
  chrome.storage.local.get(['breaklength', 'breakspeech']).then((result) => {
      let length = result['breaklength'];
      let speech = result['breakspeech'];
      remnants = remnants.map(c => c.trimEnd())
            .filter(x => !x.includes("无错版本"))
            .filter(x => !x.includes("最新章节"));;
      mergeAllClosers(remnants);
      mergeAllClosers(remnants, "“", "”", "", true);
      remnants = remnants.filter(x =>  x.length >= length
          || x.trim().startsWith("【")
          || x.trim().startsWith("「")
          || (x.includes("：") && !x.includes("“") && check_right(x))
          || (x.includes('“') && x.length >= speech)
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
      var final_html = `${h1}${first_line.trimEnd()}${remnants.join('\n<br><br>&emsp;&emsp;\n')}\n<br>\n${last_remnant}\n<br>\n${last_line}`;

      document.getElementsByClassName(cls_name)[0].innerHTML = final_html;
  });
}



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

// Returns bool. Check whether there are anything on the RHS of : (colon). 
// If something, returns true, else returns false. 
function check_right(item) {
    var new_item = item.split("：");
    if (new_item.length === 1) return false;
    if (new_item.pop().length === 0) return false;
    return true;
}