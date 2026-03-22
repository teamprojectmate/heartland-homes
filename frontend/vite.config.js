
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['src/styles'],
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          maps: ['leaflet', 'react-leaflet'],
          ui: ['react-icons', 'react-datepicker', 'react-i18next', 'i18next'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
        },
      },
    },
  },
});