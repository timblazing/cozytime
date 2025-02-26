import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cozytime/',  // Set the base path for your app
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
