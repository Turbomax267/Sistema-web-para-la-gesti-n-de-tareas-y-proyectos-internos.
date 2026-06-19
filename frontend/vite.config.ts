import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Sistema-web-para-la-gesti-n-de-tareas-y-proyectos-internos./',
  plugins: [react()],
  server: {
    port: 5173,
  },
});