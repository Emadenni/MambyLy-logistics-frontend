(function () {
  if (document.documentElement.getAttribute("data-boot") !== "legacy") return;
  var icons = document.querySelectorAll("link[data-boot-icon]");
  for (var i = 0; i < icons.length; i++) icons[i].parentNode.removeChild(icons[i]);
  document.head.appendChild(document.getElementById("boot-head-legacy").content.cloneNode(true));
})();
