setTimeout(() => {
  main();
}, 100);

function main() {
  document.body.style.background = "#f2f3f4";
  const book = document.getElementById('book') ?? document.getElementsByClassName('detail-box')[0];
  book.style.background = "#ccdfcd";

  const txt = document.getElementById('content') ?? document.getElementsByClassName('showtxt')[0];
  txt.style.fontSize = '32px';

  const data = txt.innerText.split('\n\n\n');
  let spch_list = data.filter(x =>  x.length >= 40
      || x.trim().startsWith("【")
      || x.includes("：")
      || (x.includes('“') && x.length >= 20)
  );
  spch_list = spch_list.map(c => `  ${c.trim()}`)
  txt.innerText = spch_list.join('\n\n');
  txt.innerHTML = txt.innerHTML.split('<br><br>').join('<br><br>&emsp;&emsp;')
}