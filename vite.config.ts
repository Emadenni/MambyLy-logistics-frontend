import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, 
    environment: 'jsdom', 
    setupFiles: './setup-tests.ts', 
    coverage: {
      provider: 'v8', 
      reporter: ['json-summary', 'lcov', 'text'], 
      include: ['src/**/*.{ts,tsx,js,jsx}'], 
      outputDirectory: './coverage', 
      all: true, 
    },
  },
});
