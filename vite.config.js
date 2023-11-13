import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wasm } from '@rollup/plugin-wasm';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import federation from '@originjs/vite-plugin-federation';
import { svgLoader } from './viteSvgLoader';

const copyFiles = {
  targets: [
    {
      src: 'node_modules/@matrix-org/olm/olm.wasm',
      dest: '',
    },
    {
      src: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
      dest: '',
    },
    {
      src: '_redirects',
      dest: '',
    },
    {
      src: 'config.json',
      dest: '',
    },
    {
      src: 'public/manifest.json',
      dest: '',
    },
    {
      src: 'public/res/android',
      dest: 'public/',
    },
  ],
};

export default defineConfig({
  appType: 'spa',
  publicDir: false,
  base: '',
  server: {
    port: 8080,
    host: true,
    cors: true,
  },
  plugins: [
    viteStaticCopy(copyFiles),
    vanillaExtractPlugin(),
    svgLoader(),
    wasm(),
    react(),
    federation({
      name: 'Cinny',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/pages/App',
        './CinnySettings': './src/client/state/settings',
        './InitMatrixFn': './src/client/initMatrix',
        './CinnyAuthUtils': './src/client/action/auth.js',
      },
      shared: [
        'react',
        'react-dom',
        'react-aria',
        'react-autosize-textarea',
        'formik',
        'immer',
        '@vanilla-extract/css',
        '@vanilla-extract/recipes',
        'prismjs',
        'folds',
        'folds/dist/style.css',
        '@fontsource/inter/variable.css',
        'katex',
        'katex/dist/katex.min.css',
        'emojibase',
      ],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        // Enable esbuild polyfill plugins
        NodeGlobalsPolyfillPlugin({
          process: false,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    copyPublicDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
  },
});
