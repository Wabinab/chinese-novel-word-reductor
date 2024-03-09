setTimeout(() => {
  main();
}, 100);

function main() {
  document.body.style.background = "#f2f3f4";
  document.getElementsByClassName('content')[0].style.backgroundColor = "#ccdfcd";
  document.getElementById('content').style.fontSize = '32px';

  // Break point 40 + speech, by default. 
  const content = document.getElementById('content');
  const text = content.innerText.split('\n\n');
  const spch_list = text.filter(x =>  x.trim().length >= 40
      || x.trim().startsWith("【")
      || (x.includes('“') && x.trim().length >= 10)
  );
  content.innerText = spch_list.join('\n\n') + '\n\n';
}