import { defineConfig, mergeConfig } from 'vite'
import config from './vite.config'
export default mergeConfig(config, defineConfig({
  build: { rolldownOptions: { input: { main: 'index.html', haloQa: 'halo-qa.html' } } },
}))
