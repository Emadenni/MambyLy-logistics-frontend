import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteMockServe } from 'vite-plugin-mock';
import { VitestPlugin } from 'vitest';

export default defineConfig({
  plugins: [
    react(),
    VitestPlugin()  
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul', 
      reporter: ['text', 'json', 'html'],  
    },
  },
});
