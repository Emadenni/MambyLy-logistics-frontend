(function () {
  var t = document.getElementById("boot-loader-" + document.documentElement.getAttribute("data-boot"));
  if (t) document.body.insertBefore(t.content.cloneNode(true), t);
})();
