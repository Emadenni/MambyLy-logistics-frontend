import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import staticRouteMeta from "./build/static-route-meta";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  // Public form endpoint, not a secret. A production build always has it, whatever the host's build
  // settings; VITE_FORMSPREE_ENDPOINT overrides it. Development and the local demo stay without.
  const formspree = loadEnv(mode, process.cwd(), "VITE_").VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/mljjpqzg";

  return {
    plugins: [react(), viteMockServe(), staticRouteMeta()],
    define: {
      // eventuali definizioni globali
      ...(isProduction ? { "import.meta.env.VITE_FORMSPREE_ENDPOINT": JSON.stringify(formspree) } : {}),
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