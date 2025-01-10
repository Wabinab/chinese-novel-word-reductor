var hosts = ["69shu", "69shuba", "69xinshu", "69yuedu", "twkan"]
if (hosts.filter(h => window.location.host.includes(h)).length > 0) {
  // var mainhtml = document.getElementsByClassName("txtnav")[0].innerHTML;
  // mainhtml = mainhtml.replaceAll('</p>\n', '</p>\n<br>')
  // document.getElementsByClassName("txtnav")[0].innerHTML = mainhtml;
  let cls_name = "txtnav"
  try {
      document.getElementsByClassName(cls_name)[0].style.lineHeight = '2em'
  } catch {
      cls_name = "txtbox";
      document.getElementsByClassName(cls_name)[0].style.lineHeight = '2em'
  }
  document.getElementsByClassName(cls_name)[0].innerHTML = document.getElementsByClassName("txtnav")[0].innerHTML.split('<p>').join('<p>&emsp;&emsp;');
}