var intervalId = window.setInterval(function(){
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.removeAttribute('target');
});
}, 1000);
setTimeout(() => clearInterval(intervalId), 20000);  // After 20 seconds.