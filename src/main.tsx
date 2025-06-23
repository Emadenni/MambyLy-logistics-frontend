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
if (splash) {
  splash.style.opacity = "0";
  splash.style.visibility = "hidden";
  setTimeout(() => splash.remove(), 1000);
}

});
