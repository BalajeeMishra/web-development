var svgContainer = document.getElementById('svgContainer');
var animItem = lottie.loadAnimation({
  wrapper: svgContainer,
  animType: 'svg',
  loop: true,
path: 'https://labs.nearpod.com/bodymovin/demo/markus/isometric/markus2.json',
  
  name:"bala"
}); 
function changeCss () {
    var bodyElement = document.querySelector("body");
    
    // this.scrollY > 200 ? lottie.setSpeed(1) : lottie.setSpeed(0.2);
  }
  window.addEventListener("scroll", changeCss , false);
  lottie.setDirection(0.6);
  
// lottie.setDirection(0.1);
// animItem.stop("bala")
 lottie.setSpeed(0.5); 