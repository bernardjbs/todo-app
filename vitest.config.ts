import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'api',
          include: ['apps/api/src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'hooks',
          include: ['.claude/hooks/__tests__/*.test.ts'],
        },
      },
      'apps/web/vitest.config.ts',
    ],
  },
});
