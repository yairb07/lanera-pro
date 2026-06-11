-- PASO 1: Limpieza Total y Preparación de la Base de Datos
-- Este script dejará la base de datos lista para Producción Real

-- 1. Borramos todos los datos de prueba (Mocks) en cascada
TRUNCATE TABLE app_users CASCADE;
TRUNCATE TABLE employees CASCADE;

-- 2. Agregamos la columna DNI a la tabla de empleados (si no existe)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS dni VARCHAR(20) UNIQUE;

-- 3. Insertamos a la Administradora Principal (Flor Cholan)
-- El hash corresponde a la contraseña: "12345678" generada de forma segura con bcrypt
INSERT INTO app_users (username, password_hash, full_name, role, is_active)
VALUES (
  'flor.cholan', 
  '$2b$12$QYIqIR0zomuCE/8Qf276p.4WRrelD9uV6hOTNpguah0fSRJtzk96G', 
  'Flor Cholan', 
  'admin', 
  true
);
