setTimeout(() => {
  document.body.style.background = "#f2f3f4";
  document.getElementsByClassName('box_con')[0].style.backgroundColor = "#ccdfcd";
  document.getElementById('content').innerHTML = document.getElementById('content').innerHTML.replaceAll('</p><p>', '</p><br><p>');
}, 500);