import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    name: 'web',
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
    passWithNoTests: true,
  },
});
