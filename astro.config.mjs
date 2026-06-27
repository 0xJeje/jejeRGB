// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom apex domain on GitHub Pages: set `site`, do NOT set `base`.
export default defineConfig({
  site: 'https://jeje.ro',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      serialize(item) {
        if (item.url === 'https://jeje.ro/') {
          return { ...item, priority: 1, changefreq: 'weekly' };
        }
        if (
          item.url.includes('/servicii/') ||
          item.url.includes('agentie-publicitate-valea-jiului')
        ) {
          return { ...item, priority: 0.85, changefreq: 'monthly' };
        }
        return { ...item, priority: 0.5, changefreq: 'monthly' };
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
