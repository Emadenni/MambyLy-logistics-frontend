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

// Public site: "preparing the experience" stays until the fonts are in and the first screen is
// drawn (at least MIN ms from the start, never more than MAX), then lifts away like the veil.
if (splash.classList.contains("mp-boot")) {
  const MIN = 1100;
  const MAX = 3500;
  let gone = false;
  const lift = () => {
    if (gone) return;
    gone = true;
    splash.classList.add("is-ready");
    window.setTimeout(() => splash.classList.add("is-done"), 250);
    window.setTimeout(() => splash.remove(), 1100);
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
