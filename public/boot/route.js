// Boot. The same index.html serves the public site, admin/login and Sido Butik. This only picks the
// loader, image preloads and icons for the entry route; it does not touch routing, authentication
// or application state. "legacy" (/admin, /login, /sidoButik…) gets exactly the previous ones.
(function () {
  var first = location.pathname.split("/")[1].toLowerCase();
  var legacy = first === "admin" || first === "login" || first === "sidobutik";
  document.documentElement.setAttribute("data-boot", legacy ? "legacy" : "public");
})();
