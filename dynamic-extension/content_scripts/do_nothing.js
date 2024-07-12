var hosts = ["69shu", "69shuba", "69xinshu"]
if (hosts.filter(h => window.location.host.includes(h)).length > 0) {
  var mainhtml = document.getElementsByClassName("txtnav")[0].innerHTML;
  mainhtml = mainhtml.replaceAll('</p>\n', '</p>\n<br>')
  document.getElementsByClassName("txtnav")[0].innerHTML = mainhtml;
  document.getElementsByClassName("txtnav")[0].style.lineHeight = '2em'
}