// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://micopay.com.mx',
  integrations: [react(), sitemap()],
  // Con "file" la ruta se sirve directo (p.ej. /admin no aplica aquí porque
  // vive en el Worker, no en Astro) en vez del formato "directory" con 307.
  build: { format: 'file' },
  trailingSlash: 'never',
});
