import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { redirectsPlugin } from './plugins/redirects';

export default defineConfig({
  plugins: [react(), redirectsPlugin()],
  build: {
    // The redirect stubs are emitted as extra assets, so keep the hashed app
    // bundle in its own folder and out of their way.
    assetsDir: 'assets',
  },
});
