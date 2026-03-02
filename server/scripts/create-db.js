#!/usr/bin/env node
/**
 * Create thayai_db database (run as postgres user or with create db rights)
 * Usage: node scripts/create-db.js
 * Or: createdb thayai_db
 */
const { execSync } = require('child_process');

const dbName = process.env.THAYAI_DB_NAME || 'thayai_db';

try {
  execSync(`createdb ${dbName}`, { stdio: 'inherit' });
  console.log(`Database ${dbName} created successfully.`);
} catch (err) {
  if (err.message && err.message.includes('already exists')) {
    console.log(`Database ${dbName} already exists.`);
  } else {
    console.error('Create database manually: createdb thayai_db');
    process.exit(1);
  }
}
