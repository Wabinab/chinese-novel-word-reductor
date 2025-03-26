document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.removeAttribute('target');
});