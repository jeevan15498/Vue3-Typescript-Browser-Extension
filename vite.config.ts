import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy' // https://www.npmjs.com/package/rollup-plugin-copy
import { fileURLToPath } from "url";

// Extension Configuration
import { outputFolderPath, alias, define, manifestTransform } from './extension';
import buildContentScript from './utils/plugins/build';

// Get Vite Config
export function getViteConfig() {

  // https://vitejs.dev/config/
  var config = {
    mode: process.env.NODE_ENV || 'development', // development, production
    root: resolve(__dirname, 'src'),
    // publicDir: resolve(__dirname, 'src/assets'),
    build: {
      // cssCodeSplit: false,
      // polyfillModulePreload: false,
      outDir: outputFolderPath,
      rollupOptions: {
        input: {
          // Pages
          "options": resolve(__dirname, 'src/pages/options/options.html'),
          // Background
          "service-worker": resolve(__dirname, 'src/background/background'),
        },
        output: {
          entryFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
          chunkFileNames: "[name][hash].js",
          sourcemap: false,
          // inlineDynamicImports: true,
        }
      },
      // watch: {},
      sourcemap: false,
      minify: 'esbuild', // 'terser', // build.terserOptions
      emptyOutDir: true,
    },
    plugins: [
      vue(),
      copy({
        targets: [
          { src: 'src/_locales/*', dest: 'dist/_locales' },
          { src: 'src/assets/*', dest: 'dist/assets' },
          { src: 'src/icons/*', dest: 'dist/icons' },
          {
            src: "src-" + process.env.BROWSER_TYPE + "/manifest.json",
            dest: 'dist',
            transform: (contents, filename) => {
              var fD = manifestTransform(JSON.parse(contents.toString()))
              return Buffer.from(
                JSON.stringify({
                  version: process.env.npm_package_version,
                  ...fD,
                })
              );
            }
          }
        ],
        verbose: true,
        copyOnce: false,
        hook: 'writeBundle'
      }),
      buildContentScript()
    ],
    // Define Global Variable
    define: define,
    resolve: {
      alias: alias
    }
  };

  if (process.env.NODE_ENV === 'production') {
    config.build.minify = 'terser'; // build.terserOptions
    // @ts-ignore
    config.build.terserOptions = {
      format: {
        comments: false
      },
      compress: {
        // https://github.com/terser/terser#compress-options
        drop_console: true,
        drop_debugger: true,
      },
    };
  }

  return config
}