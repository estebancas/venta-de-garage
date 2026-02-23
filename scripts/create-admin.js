#!/usr/bin/env node

/**
 * Script to create an admin user in Supabase
 * Usage: node scripts/create-admin.js <email> <password>
 * Or: npm run create-admin <email> <password>
 */

const https = require('http');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error(`${colors.red}Error: Missing required arguments${colors.reset}`);
  console.log('Usage: node scripts/create-admin.js <email> <password>');
  console.log('Example: node scripts/create-admin.js admin@example.com mySecurePassword123');
  process.exit(1);
}

const [email, password] = args;

// Validate email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailRegex.test(email)) {
  console.error(`${colors.red}Error: Invalid email format${colors.reset}`);
  process.exit(1);
}

// Validate password length
if (password.length < 6) {
  console.error(`${colors.red}Error: Password must be at least 6 characters${colors.reset}`);
  process.exit(1);
}

// Supabase local development credentials
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log(`${colors.yellow}Creating admin user...${colors.reset}`);
console.log(`Email: ${email}`);

const postData = JSON.stringify({
  email,
  password,
});

const options = {
  hostname: '127.0.0.1',
  port: 54321,
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'apikey': SUPABASE_ANON_KEY,
  },
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.access_token) {
        console.log(`${colors.green}✓ Admin user created successfully!${colors.reset}`);
        console.log('');
        console.log('Login credentials:');
        console.log(`  Email:    ${email}`);
        console.log(`  Password: ${password}`);
        console.log('');
        console.log('You can now login at: http://localhost:3000/admin');
      } else {
        console.error(`${colors.red}✗ Failed to create user${colors.reset}`);
        console.log('Response from Supabase:');
        console.log(JSON.stringify(response, null, 2));
        process.exit(1);
      }
    } catch (error) {
      console.error(`${colors.red}✗ Failed to parse response${colors.reset}`);
      console.error(error.message);
      console.log('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`${colors.red}✗ Request failed${colors.reset}`);
  console.error(error.message);
  console.log('');
  console.log('Make sure Supabase is running:');
  console.log('  npm run supabase:start');
  process.exit(1);
});

req.write(postData);
req.end();
