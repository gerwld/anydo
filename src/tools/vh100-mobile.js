(function init100vh() {
 function setHeight() {
  document.documentElement.style.setProperty("--vh100", `${window.innerHeight}px`);
 }
 setHeight();
 
//  setInterval(setHeight, 500);
 window.addEventListener("resize", setHeight);
})();
