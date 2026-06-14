import { pool } from '../db.js';

const sql = `
-- Crear tabla de ajustes
CREATE TABLE IF NOT EXISTS ajustes (
  clave VARCHAR(100) PRIMARY KEY,
  valor TEXT NOT NULL
);

INSERT INTO ajustes (clave, valor)
VALUES ('visibilidad_empleados', 'todos')
ON CONFLICT (clave) DO NOTHING;

-- Crear tabla de roles de empleados
CREATE TABLE IF NOT EXISTS employee_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employee_roles (name)
VALUES ('Tejedora'), ('Remalladora'), ('Acabados'), ('Corte'), ('Supervisor')
ON CONFLICT (name) DO NOTHING;
`;

async function runMigration() {
  console.log('Iniciando migración de la base de datos...');
  try {
    await pool.query(sql);
    console.log('¡Migración completada con éxito!');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
