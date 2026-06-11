import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '..', 'server', 'scripts', 'schema_production.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
});

try {
  await pool.query(sql);
  const users = await pool.query(`select username, role from app_users`);
  console.log('Esquema aplicado. Usuarios:', users.rows);
} catch (error) {
  console.error('Error aplicando esquema:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
