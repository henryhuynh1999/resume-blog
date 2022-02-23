var el1 = document.getElementsByTagName("body")[0];
el1.setAttribute("style", "overflow: hidden;");
function ready() {
  setTimeout(removeLoad, 2000);
}
function removeLoad() {
  var el = document.getElementById("shiba");
  el.setAttribute("style", "display: none;");
  console.log(el);
}
ready();
window.addEventListener("mousemove", (event) => {
  console.log(event.clientX);
});
