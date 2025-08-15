const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Testing Backend Startup...');

// Test if the backend can start
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'pipe',
  shell: true
});

let output = '';
let errorOutput = '';

backendProcess.stdout.on('data', (data) => {
  const message = data.toString();
  output += message;
  console.log('📤 STDOUT:', message.trim());
  
  if (message.includes('Server running on port')) {
    console.log('✅ Backend started successfully!');
    backendProcess.kill();
    process.exit(0);
  }
});

backendProcess.stderr.on('data', (data) => {
  const message = data.toString();
  errorOutput += message;
  console.error('❌ STDERR:', message.trim());
});

backendProcess.on('error', (error) => {
  console.error('❌ Process error:', error);
});

backendProcess.on('close', (code) => {
  console.log(`\n📊 Process exited with code ${code}`);
  console.log('\n📋 Full output:');
  console.log(output);
  
  if (errorOutput) {
    console.log('\n❌ Errors:');
    console.log(errorOutput);
  }
  
  if (code !== 0) {
    console.log('\n❌ Backend failed to start properly');
    process.exit(1);
  }
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏰ Startup timeout - killing process');
  backendProcess.kill();
  process.exit(1);
}, 30000);
