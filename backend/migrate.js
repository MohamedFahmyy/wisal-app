import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('[Wisal Backend] Starting database migration...');

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('[Error] schema.sql not found at', schemaPath);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Connect to MySQL server (without selecting DB first, to ensure DB exists)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  try {
    const dbName = process.env.DB_NAME || 'wisal_rsvp';
    console.log(`[Wisal Backend] Ensuring database "${dbName}" exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log('[Wisal Backend] Executing schema.sql statements...');
    await connection.query(schemaSql);

    console.log('✓ [Wisal Backend] Migration completed successfully. Tables are ready!');
  } catch (err) {
    console.error('✗ [Wisal Backend] Migration failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
