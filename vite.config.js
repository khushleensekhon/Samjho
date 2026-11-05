import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the same build works on Vercel (/) and GitHub Pages (/samjho/).
export default defineConfig({
  plugins: [react()],
  base: './',
});
