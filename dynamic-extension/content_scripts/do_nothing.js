var hosts = ["69shu", "69shuba", "69xinshu", "69yuedu", "twkan", "mterb"]
if (hosts.filter(h => window.location.host.includes(h)).length > 0) {
  const scripts = document.querySelectorAll("script");
	scripts.forEach(s => {
		if (s.src.includes('ads') || s.src.includes('otherad') || s.src.includes('ad.js')) {
			s.remove();
		}
	});

  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.removeAttribute('target');
  });
  let txtcenter = document.getElementsByClassName('txtcenter');
  let txtcenter_len = txtcenter.length
  for (let i = 0; i < txtcenter_len; i++) {
      txtcenter[0].remove()  // remove modify the array length. 
  }
  
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