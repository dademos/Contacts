// Learn more about Vitest configuration options at https://vitest.dev/config/

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'happy-dom',
    globals: true,
    reporters: [
      'default',
      [
        'junit',
        {
          outputFile: 'test-results/junit.xml',
          suiteName: 'React Unit Tests',
        },
      ],
    ],
  },
});
