// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom apex domain on GitHub Pages: set `site`, do NOT set `base`.
export default defineConfig({
  site: 'https://jeje.ro',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
