import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dayjs from 'dayjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // ----------------------------------------------------------------------------
    // Modifying the content the generated index.html to append something like
    //  ?v=2024.28.11-14.17.53 to the static assets to avoid caching-related issues
    // ----------------------------------------------------------------------------
    {
      name: 'html-transform',
      apply: 'build',
      transformIndexHtml(html) {
        const version = dayjs().format('YYYY.MM.DD-HH.mm.ss');

        // Finds all <script> tags with a src attribute and appends ?v=timestamp to the URL.
        return html.replace(/<script.*?src="(.*?)".*?>/g, (match, src) => {
          return match.replace(src, `${src}?v=${version}`);

          // Finds all <link> tags (e.g., for CSS) and appends the same ?v=timestamp.
        }).replace(/<link.*?href="(.*?)".*?>/g, (match, href) => {
          return match.replace(href, `${href}?v=${version}`);
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // ------------------------------------------------------
  // Rule for not adding strange suffix for generated files
  // ------------------------------------------------------
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  }
})
