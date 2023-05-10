import { PluginOption, InlineConfig, build } from 'vite';
import { outputFolderPath, entires, alias, define } from '../../extension';

export default function buildContentScript(): PluginOption {
  return {
    name: 'build-content',
    async closeBundle() {
      for (const entry of entires) {
        var config = {
          mode: process.env.NODE_ENV || 'development', // development, production
          publicDir: false,
          build: {
            outDir: outputFolderPath,
            emptyOutDir: false,
            watch: (process.env.NODE_ENV === 'development' ? {} : null),
            rollupOptions: {
              input: entry,
              output: {
                entryFileNames: "[name].js",
                assetFileNames: "[name].[ext]",
                chunkFileNames: "[name][hash].js",
                sourcemap: false,
              },
            },
          },
          configFile: false,
          define: define,
          resolve: {
            alias: alias
          }
        } as InlineConfig;

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

        // BUILD
        await build(config);
      }
    },
  };
}
