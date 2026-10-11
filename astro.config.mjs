import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.elieschulman.com',
  integrations: [
    sitemap({
      // Audio routes stay built so they are easy to restore, but they are
      // still "Coming soon" and should not be advertised.
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        return pathname !== '/audio' && !pathname.startsWith('/audio/');
      },
    }),
  ],
});
