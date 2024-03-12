setTimeout(() => {
  document.body.style.backgroundColor = "#f2f3f4";
  document.getElementById('amain').style.backgroundColor = "#ccdfcd";
  if (window.screen.width >= 540) document.getElementById('contents').style.fontSize = '32px';

  document.getElementById('contents').innerHTML = document.getElementById('contents').innerHTML.replaceAll('<p>', '<p style="letter-spacing: 1px">');
}, 400);
