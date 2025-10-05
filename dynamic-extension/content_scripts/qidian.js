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

function check_right(item) {
  var new_item = item.split("：");
  if (new_item.length === 1) return false;
  if (new_item.pop().length === 0) return false;
  return true;
}

// ====================================================

const v = document.getElementsByTagName('main')[0];
let txt = v.innerText;
let remnants = txt.split('\n\n');
remnants = remnants.filter(c => c != '');

remnants = remnants.map(c => c.trimEnd());
mergeAllClosers(remnants);
mergeAllClosers(remnants, "“", "”", "", true);
mergeAllClosers(remnants, "「", "」", "", true);
remnants = remnants.filter(x =>  x.length >= 38 
  || x.trim().startsWith("【")
  || (x.trim().startsWith("「"))
  || (x.includes("：") && !x.includes("“") && check_right(x))
);

const final_html = `<p>${remnants.join('</p><p>')}</p>`;
v.innerHTML = final_html;

