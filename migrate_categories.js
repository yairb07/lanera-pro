import 'dotenv/config';
import { pool } from './server/db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Iniciando migración...");
    await client.query('BEGIN');

    // 1. Crear la tabla
    console.log("Creando tabla garment_categories...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS garment_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Insertar General
    console.log("Insertando categoría por defecto...");
    await client.query(`
      INSERT INTO garment_categories (name) VALUES ('General') ON CONFLICT DO NOTHING;
    `);

    // 3. Alterar la tabla garments
    console.log("Añadiendo category_id a prendas...");
    await client.query(`
      ALTER TABLE garments 
      ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES garment_categories(id) ON DELETE SET NULL;
    `);

    await client.query('COMMIT');
    console.log("¡Migración completada con éxito!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error durante la migración:", error);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
