import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://localbran-backend.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
    },
    plugins: [react(), tailwindcss()],
  };
});