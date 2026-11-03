// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: [
      'default',
      [
        'junit',
        {
          outputFile: 'test-results/junit.xml',
          suiteName: 'Angular Unit Tests',
        },
      ],
    ],
  },
});
