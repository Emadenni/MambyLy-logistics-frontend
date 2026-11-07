import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import React from 'react'

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// ✅ Rimuove il loader statico una volta che React è montato
window.addEventListener("DOMContentLoaded", () => {
const splash = document.getElementById("initial-loader");
if (!splash) return;

// Public site: the page is "ready" once the fonts are in and the first screen is drawn (at least
// MIN ms from the start, never more than MAX); then it says so (html[data-ready], "mp:ready"), and
// the home veil shows its swipe control. On the home page the veil (the same picture, with the same
// loading ring) takes over from this screen at once; elsewhere this screen lifts away when ready.
if (splash.classList.contains("mp-boot")) {
  const MIN = 1200;
  const MAX = 3500;
  const home = /^\/(en\/?)?$/i.test(location.pathname);
  if (home) requestAnimationFrame(() => requestAnimationFrame(() => splash.remove()));
  let gone = false;
  const lift = () => {
    if (gone) return;
    gone = true;
    document.documentElement.dataset.ready = "1";
    window.dispatchEvent(new Event("mp:ready"));
    if (home) return;
    splash.classList.add("is-done");
    window.setTimeout(() => splash.remove(), 900);
  };
  const ready = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))),
  ]);
  const wait = Math.max(0, MIN - performance.now());
  ready.then(() => window.setTimeout(lift, wait));
  window.setTimeout(lift, Math.max(0, MAX - performance.now()));
  return;
}

// Legacy (admin, login, Sido Butik): exactly as before.
splash.style.opacity = "0";
splash.style.visibility = "hidden";
setTimeout(() => splash.remove(), 1000);
});
