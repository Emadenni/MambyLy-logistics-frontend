(function () {
  var t = document.getElementById("boot-loader-" + document.documentElement.getAttribute("data-boot"));
  if (t) document.body.insertBefore(t.content.cloneNode(true), t);
  // public loader in English on /en addresses
  if (/^\/en(\/|$)/i.test(location.pathname)) {
    var text = document.querySelector("[data-boot-text]");
    var sr = document.querySelector("[data-boot-sr]");
    if (text) text.textContent = "Preparing the experience";
    if (sr) sr.textContent = "Loading…";
  }
})();
