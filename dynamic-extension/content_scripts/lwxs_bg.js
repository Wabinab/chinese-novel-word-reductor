setTimeout(() => {
  document.body.style.background = "#f2f3f4";
  document.getElementsByClassName('box_con')[0].style.backgroundColor = "#ccdfcd";
  document.getElementById('content').innerHTML = document.getElementById('content').innerHTML.replaceAll('</p><p>', '</p><br><p>');

  const content = document.getElementById('content');
  const text = content.innerText.split('\n\n');
  const spch_list = text.filter(x =>  x.trim().length >= 40
      || x.trim().startsWith("【")
      || (x.includes("：") && x.length <= 15 && !x.includes("“"))
      || (x.includes('“') && x.trim().length >= 10)
  );
  const scph_list2 = spch_list.map(c => '<p>' + c.trimStart('\n'));
  content.innerHTML = scph_list2.join('</p><br><p>');

  // Set next page button
  let prev_href = getElementsByText('上一章', 'a')[0].href;
  let next_href = getElementsByText('下一章', 'a')[0].href;
  function checkKey(e) {
      e = e || window.event;
      if (e.keyCode == '37') {
        window.location.href = prev_href;
      }
      else if (e.keyCode == '39') {
        window.location.href = next_href;
      }
  }
  document.onkeydown = checkKey;
}, 100);


function getElementsByText(str, tag = 'a') {
  return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}

