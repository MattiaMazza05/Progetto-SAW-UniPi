import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'WebApp Mattia', 
        short_name: 'WA SAW',
        description: 'La mia applicazione per gli allenamenti', 
        display:'standalone',
        start_url:'/',
        icons: [
          {
            src: '/icons/app-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/app-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: "any maskable",
          }
        ]
      }
    })
  ],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
