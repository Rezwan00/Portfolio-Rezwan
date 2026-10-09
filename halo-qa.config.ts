import { defineConfig, mergeConfig } from 'vite'
import config from './vite.config.ts'
export default mergeConfig(config, defineConfig({
  build: { rolldownOptions: { input: { main: 'index.html', haloQa: 'halo-qa.html', motionReview: 'motion-review.html' } } },
}))
