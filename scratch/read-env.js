const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Simple parser for .env.local
const lines = envContent.split('\n');
let uri = '';
for (const line of lines) {
  if (line.startsWith('MONGODB_URI=')) {
    uri = line.split('=')[1].replace(/"/g, '').trim();
    break;
  }
}

if (uri) {
  const match = uri.match(/:\/\/[^:]+:([^@]+)@/);
  if (match) {
    const password = match[1];
    console.log('Password length:', password.length);
    console.log('Password characters:', password);
  }
}
