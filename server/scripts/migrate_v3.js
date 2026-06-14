import { pool } from '../db.js';

const sql = `
-- Agregar columna de permisos por empleado (vista de catálogo)
-- 'todos' = ve computarizados y manuales
-- 'manuales' = solo ve diseños manuales
-- 'computarizadas' = solo ve diseños computarizados
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS permisos_catalogo VARCHAR(50) DEFAULT 'todos';
`;

async function runMigration() {
  console.log('Iniciando migración v3: permisos por empleado...');
  try {
    await pool.query(sql);
    console.log('¡Migración v3 completada con éxito!');
  } catch (error) {
    console.error('Error durante la migración v3:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
