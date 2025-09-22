import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        logistics: resolve(__dirname, 'logistics.html'),
        paper: resolve(__dirname, 'paper.html'),
        resourcesDesign: resolve(__dirname, 'resources/design.html'),
        resourcesLibrary: resolve(__dirname, 'resources/library.html'),
        resourcesOverview: resolve(__dirname, 'resources/overview.html'),
        resourcesChecklists: resolve(__dirname, 'resources/checklists.html'),
        resourcesInsights: resolve(__dirname, 'resources/insights.html'),
        resourcesSmartPackaging: resolve(__dirname, 'resources/smart-packaging.html'),
        resourcesColdChain: resolve(__dirname, 'resources/cold-chain-packaging.html'),
        resourcesCostGuide: resolve(__dirname, 'resources/packaging-cost.html'),
      },
    },
  },
});
