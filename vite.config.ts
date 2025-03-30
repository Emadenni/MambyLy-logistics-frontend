import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"; 

  return {
    plugins: [react(), viteMockServe()],
    define: {
     
      "import.meta.env.MODE": mode,  
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
  };
});