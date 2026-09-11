import { spawn } from 'child_process';
import path from 'path';

console.log(' Starting Backend Server for integration tests...');

const server = spawn('node', ['backend/src/index.js'], { stdio: 'inherit' });

// Wait 2 seconds for server to bind port
setTimeout(() => {
  console.log('\n Executing integration tests...\n');
  const test = spawn('node', ['backend/test/api.test.js'], { stdio: 'inherit' });

  test.on('close', (code) => {
    console.log(`\n Tests completed with exit code ${code}`);
    server.kill('SIGINT');
    process.exit(code);
  });
}, 2000);
