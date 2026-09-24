import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base relativa: permite desplegar en GitHub Pages (subcarpeta), Vercel o Netlify
// sin tener que reconfigurar rutas.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
