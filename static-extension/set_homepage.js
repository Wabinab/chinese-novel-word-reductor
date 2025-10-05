document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.removeAttribute('target');
});
let txtcenter = document.getElementsByClassName('txtcenter');
let txtcenter_len = txtcenter.length
for (let i = 0; i < txtcenter_len; i++) {
    txtcenter[0].remove()  // remove modify the array length. 
}

// TWKAN
var intervalId = window.setInterval(function(){
    var item = document.getElementById('mobile-ad');
    if (item) item.remove();
}, 500);
setTimeout(() => clearInterval(intervalId), 10000);  // After 10 seconds.