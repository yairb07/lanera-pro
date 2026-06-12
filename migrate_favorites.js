import 'dotenv/config';
import { pool } from './server/db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Añadiendo columna is_favorite a prendas...");
    await client.query('BEGIN');
    await client.query(`
      ALTER TABLE garments 
      ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
    `);
    await client.query('COMMIT');
    console.log("¡Migración de favoritos completada!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error:", error);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
