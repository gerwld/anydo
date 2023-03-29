var intervalID;
const setBodyFixed = (isFixed) => {
 const interval = () => {
  window.scrollTo(0, 0);
 };

 if (isFixed) {
  intervalID = setInterval(interval, 500);
  interval();
  document.body.classList.add("no-scroll");
 } else {
  clearInterval(intervalID);
  document.body.classList.remove("no-scroll");
 }
};

export default setBodyFixed;
