import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dayjs from 'dayjs'

const version = dayjs().format('YYYY.MM.DD-HH.mm.ss')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      // ----------------------------------------------------------------------------
      // Modifying the content the generated index.html to append something like
      //  ?v=2024.28.11-14.17.53 to the static assets to avoid caching-related issues
      // and also replace /assets/ with /static/ui/assets/
      // ----------------------------------------------------------------------------
      name: 'index.html load assets from /static/ui/',
      apply: 'build',
      transformIndexHtml(html) {
        return (
          html
            // Replacing /assets/ with /static/ui/assets/
            .replace(/src="\/assets\//g, 'src="/static/ui/assets/')
            .replace(/href="\/assets\//g, 'href="/static/ui/assets/')
            .replace(/href="\/favicon.ico/g, 'href="/static/ui/favicon.ico')

            // Finds all <script> tags with a src attribute and appends ?v=timestamp to the URL.
            .replace(/<script.*?src="(.*?)".*?>/g, (match, src) => {
              return match.replace(src, `${src}?v=${version}`)
            })
            // Finds all <link> tags (e.g., for CSS) and appends the same ?v=timestamp.
            .replace(/<link.*?href="(.*?)".*?>/g, (match, href) => {
              return match.replace(href, `${href}?v=${version}`)
            })
        )
      },
    },
    {
      // -----------------------------------------------------
      // Adding ?v=2024.28.11-14.17.53 also to dynamic imports
      // -----------------------------------------------------
      name: 'add-version-to-dynamic-imports',
      apply: 'build',
      generateBundle(_, bundle) {
        for (const [key, value] of Object.entries(bundle)) {
          if (value.type === 'chunk') {
            value.code = value.code.replace(
              /"\.\/(.*?)"/g,
              (match, filename) => `"/static/ui/assets/${filename}?v=${version}"`,
            )
          }
        }
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
