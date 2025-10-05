// TWKAN
var intervalId = window.setInterval(function(){
    var item = document.getElementById('mobile-ad');
    if (item) item.remove();
}, 500);
setTimeout(() => clearInterval(intervalId), 10000);  // After 10 seconds.