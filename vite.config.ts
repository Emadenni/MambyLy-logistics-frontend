import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import staticRouteMeta from "./build/static-route-meta";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react(), viteMockServe(), staticRouteMeta()],
    define: {
      // eventuali definizioni globali
    },
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
      },
      enabled: !isProduction, 
    },

    // 🔽 AGGIUNGI QUESTO
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  };
});