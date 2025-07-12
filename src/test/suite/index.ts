import * as path from 'path';
import { glob } from 'glob';

// Import Mocha using require to avoid TypeScript constructor issues
const Mocha = require('mocha');

/**
 * Test suite runner
 */
export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000,
    reporter: 'spec'
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    // Find all test files
    glob('**/**.test.js', { cwd: testsRoot })
      .then((testFiles) => {
        // Add files to the test suite
        testFiles.forEach((file) => {
          mocha.addFile(path.resolve(testsRoot, file));
        });

        try {
          // Run the mocha test
          mocha.run((failures: number) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      })
      .catch(reject);
  });
}
