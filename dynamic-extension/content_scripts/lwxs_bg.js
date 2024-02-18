setTimeout(() => {
  document.body.style.background = "#f2f3f4";
  document.getElementsByClassName('box_con')[0].style.backgroundColor = "#ccdfcd";
  document.getElementById('content').innerHTML = document.getElementById('content').innerHTML.replaceAll('</p><p>', '</p><br><p>');

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
}, 500);


function getElementsByText(str, tag = 'a') {
  return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}

