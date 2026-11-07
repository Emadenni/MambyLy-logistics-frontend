(function () {
  var t = document.getElementById("boot-loader-" + document.documentElement.getAttribute("data-boot"));
  if (t) document.body.insertBefore(t.content.cloneNode(true), t);
  // public loader in English on /en addresses
  if (/^\/en(\/|$)/i.test(location.pathname)) {
    var tagline = document.querySelector("[data-boot-tagline]");
    var sr = document.querySelector("[data-boot-sr]");
    if (tagline) tagline.textContent = "Simpler digital.";
    if (sr) sr.textContent = "Loading…";
  }
})();
