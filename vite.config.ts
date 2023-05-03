import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy' // https://www.npmjs.com/package/rollup-plugin-copy
import { fileURLToPath } from "url";

// Extension Configuration
import { getExtensionConfig } from './exconfig.js'
const exconfig = getExtensionConfig(process.env);

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
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: {
          // Background
          "service-worker": resolve(__dirname, 'src/background/background'),
          // Contents
          "index": resolve(__dirname, 'src/contents/index'),
          "fake": resolve(__dirname, 'src/contents/fake'),
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
              var fD = JSON.parse(contents.toString());

              // Check Extension (DEV) Version and set icon or extension name
              if (process.env.EXTENSION_TYPE === 'DEV') {

                /**
                  SET Extension Name, ShortName, Description
                  -------------------------------------------------
                  name : __MSG_appName__
                  short_name : __MSG_appShortName__
                  description : __MSG_appDescription__
                */

                try {
                  fD.name = "__MSG_appName_DEV__";
                  fD.short_name = "__MSG_appShortName_DEV__";
                  fD.description = "__MSG_appDescription_DEV__";
                } catch (error) {
                  throw new Error("VITE CONFIG ERROR:: Please set manifest name, short name, description.")
                }

                /**
                 * SET Extension Icon
                  --------------------------------
                  "action": {
                    "default_icon": {
                      "16": "icons/16x16.png",
                      "24": "icons/24x24.png",
                      "32": "icons/32x32.png"
                    }
                  },
                  "icons": {
                    "16": "icons/16x16.png",
                    "48": "icons/48x48.png",
                    "128": "icons/128x128.png"
                  },
                  */

                // SET Dev Icon
                fD["icons"]["16"] = "icons/dev/16x16.png";
                fD["icons"]["48"] = "icons/dev/48x48.png";
                fD["icons"]["128"] = "icons/dev/128x128.png";

                if (process.env.MANIFEST_VERSION == 2) {

                  // Default browser_action Icons
                  fD["browser_action"]["default_icon"]["16"] = "icons/16x16.png";
                  fD["browser_action"]["default_icon"]["24"] = "icons/24x24.png";
                  fD["browser_action"]["default_icon"]["32"] = "icons/32x32.png";

                } else if (process.env.MANIFEST_VERSION == 3) {

                  // Default Action Icons
                  fD["action"]["default_icon"]["16"] = "icons/dev/16x16.png";
                  fD["action"]["default_icon"]["24"] = "icons/dev/24x24.png";
                  fD["action"]["default_icon"]["32"] = "icons/dev/32x32.png";

                } else {
                  throw new Error("VITE CONFIG ERROR:: Please set manifest version env")
                }

              } else {
                // Default
                fD.name = "__MSG_appName__";
                fD.short_name = "__MSG_appShortName__";
                fD.description = "__MSG_appDescription__";

                // Default Icons
                fD["icons"]["16"] = "icons/16x16.png";
                fD["icons"]["48"] = "icons/48x48.png";
                fD["icons"]["128"] = "icons/128x128.png";

                // @ts-ignore
                if (process.env.MANIFEST_VERSION == 2) {

                  // Default browser_action Icons
                  fD["browser_action"]["default_icon"]["16"] = "icons/16x16.png";
                  fD["browser_action"]["default_icon"]["24"] = "icons/24x24.png";
                  fD["browser_action"]["default_icon"]["32"] = "icons/32x32.png";

                  // @ts-ignore
                } else if (process.env.MANIFEST_VERSION == 3) {

                  // Default Action Icons
                  fD["action"]["default_icon"]["16"] = "icons/16x16.png";
                  fD["action"]["default_icon"]["24"] = "icons/24x24.png";
                  fD["action"]["default_icon"]["32"] = "icons/32x32.png";

                } else {
                  throw new Error("VITE CONFIG ERROR:: Please set manifest version env")
                }
              }

              // SET: externally_connectable (NOT FOR FIREFOX BROWSER)
              if (process.env.BROWSER_TYPE !== "firefox") {
                if (!exconfig.id === false && !exconfig.matchesURL === false) {
                  fD.externally_connectable.ids.push(exconfig.id)
                  fD.externally_connectable.matches = exconfig.matchesURL
                }
              }

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
    ],
    // Define Global Variable
    define: {
      '_env.NODE_ENV': "'" + process.env.NODE_ENV + "'",
      '_env.MANIFEST_VERSION': "'" + process.env.MANIFEST_VERSION + "'",
      '_env.BROWSER_TYPE': "'" + process.env.BROWSER_TYPE + "'",
      '_env.EXTENSION_TYPE': "'" + process.env.EXTENSION_TYPE + "'",
      '_env.IS_ENCODE_SCRIPTS': "'" + process.env.IS_ENCODE_SCRIPTS + "'",
    },
    resolve: {
      alias: {
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url))
      }
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