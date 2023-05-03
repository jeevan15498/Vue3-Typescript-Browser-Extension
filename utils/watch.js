import { defineConfig, loadEnv } from 'vite'
import { getViteConfig } from '../vite.config.js'

// export default defineConfig(config);
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return defineConfig(getViteConfig());
}