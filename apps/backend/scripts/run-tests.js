// Simple test runner to execute compiled test files without tsx/esbuild
// Assumes `pnpm build` has just emitted dist/ directory.
const fs = require('fs');
const path = require('path');

const distTestsDir = path.join(__dirname, '..', 'dist', 'tests');
if (!fs.existsSync(distTestsDir)) {
  console.error('dist/tests directory not found. Did the build include test sources?');
  process.exit(1);
}

const testFiles = fs.readdirSync(distTestsDir)
  .filter(f => f.endsWith('.test.js'))
  .map(f => path.join(distTestsDir, f));

let passed = 0;
let failed = 0;
async function runFile(file) {
  try {
    require(file); // Tests are self-executing IIFEs using assert
    passed++;
  } catch (err) {
    failed++;
    console.error(`Test failed: ${file}`);
    console.error(err);
  }
}

(async () => {
  for (const file of testFiles) {
    await runFile(file);
  }
  console.log(`\nTest summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
