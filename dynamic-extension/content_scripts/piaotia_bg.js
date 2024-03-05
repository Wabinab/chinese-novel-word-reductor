setTimeout(() => {
  main();
}, 100);

function main() {
  document.body.style.background = "#f2f3f4";
  document.getElementById('content').style.backgroundColor = "#ccdfcd";
  document.getElementById('content').style.fontSize = '32px';
  document.getElementById('content').style.lineHeight = '1.8em';

  // Break point 40 + speech, by default. 
  // const content = document.getElementById('chaptercontent');
  // const text = content.innerText.split('\n\n');
  // const spch_list = text.filter(x =>  x.length >= 40
  //     || x.trim().startsWith("【")
  //     || (x.includes('“') && x.length >= 0)
  // );
  // content.innerText = spch_list.join('\n\n');
}