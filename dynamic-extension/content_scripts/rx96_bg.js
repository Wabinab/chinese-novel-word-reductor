setTimeout(() => {
  main();
}, 250);

function main() {
  document.body.style.background = "#f2f3f4";
  document.getElementsByClassName('book reader')[0].style.backgroundColor = "#ccdfcd";
  document.getElementById('chaptercontent').style.fontSize = '32px';

  // Break point 40 + speech, by default. 
  const content = document.getElementById('chaptercontent');
  const text = content.innerText.split('\n\n');
  const spch_list = text.filter(x =>  x.length >= 40
      || x.trim().startsWith("【")
      || (x.includes('“') && x.length >= 20)
  );
  content.innerText = spch_list.join('\n\n');
}