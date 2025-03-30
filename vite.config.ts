import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
  plugins: [react(), viteMockServe()],
  define: {
    // Vite automaticamente carica variabili d'ambiente da `.env` e `.env.production`
  },
});
