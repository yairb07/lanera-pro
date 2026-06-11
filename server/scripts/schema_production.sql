-- ==============================================================================
-- TALLER TEXTIL - Esquema de Base de Datos para Producción (PostgreSQL)
-- ==============================================================================

-- Eliminar tablas existentes para empezar limpio (¡CUIDADO! Borrará todos los datos)
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS production_records CASCADE;
DROP TABLE IF EXISTS yarn_cones CASCADE;
DROP TABLE IF EXISTS garments CASCADE;
DROP TABLE IF EXISTS app_users CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- 1. Tabla de Empleados
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE,
  job_role VARCHAR(50) NOT NULL,
  shift VARCHAR(50),
  payment_type VARCHAR(50) NOT NULL,
  base_amount DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios del Sistema (app_users)
CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Catálogo de Prendas (garments)
CREATE TABLE garments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  image_url TEXT,
  file_program VARCHAR(150),
  laps INTEGER DEFAULT 0,
  tension VARCHAR(50),
  yarn_type VARCHAR(100),
  needle VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Conos (yarn_cones)
CREATE TABLE yarn_cones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  brand VARCHAR(100),
  color VARCHAR(100) NOT NULL,
  material VARCHAR(100),
  weight_grams INTEGER NOT NULL DEFAULT 1000,
  stock_cones DECIMAL(10, 2) DEFAULT 0,
  min_stock_cones DECIMAL(10, 2) DEFAULT 5,
  supplier VARCHAR(150),
  unit_price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Producción (production_records)
CREATE TABLE production_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  garment_id UUID REFERENCES garments(id) ON DELETE SET NULL,
  cone_id UUID REFERENCES yarn_cones(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  grams_per_unit INTEGER NOT NULL,
  total_grams INTEGER NOT NULL,
  cones_used DECIMAL(10, 2) NOT NULL,
  registered_by UUID REFERENCES app_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Movimientos de Kardex (inventory_movements)
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cone_id UUID REFERENCES yarn_cones(id) ON DELETE CASCADE,
  production_record_id UUID REFERENCES production_records(id) ON DELETE SET NULL,
  movement_type VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'ajuste'
  quantity_cones DECIMAL(10, 2) NOT NULL,
  stock_before DECIMAL(10, 2) NOT NULL,
  stock_after DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATOS INICIALES (Usuario Administrador)
-- ==============================================================================

-- Administradora Principal (Flor Cholan) con clave temporal 12345678
INSERT INTO app_users (username, password_hash, full_name, role, is_active)
VALUES (
  'flor.cholan', 
  '$2b$10$CaNvrC0OtyZ40iGx9oDAd.BLJorwZass7aOdHJqK/yATrwVSVJt5u', 
  'Flor Cholan', 
  'admin', 
  true
);

-- Empleados iniciales
INSERT INTO employees (full_name, dni, job_role, shift, payment_type)
VALUES 
  ('Maria Lopez', '87654321', 'Tejedora', 'Mañana', 'piecework'),
  ('Juan Perez', '11223344', 'Remalladora', 'Tarde', 'salary');

-- Prendas iniciales
INSERT INTO garments (name, file_program, laps, tension, yarn_type, needle)
VALUES 
  ('Suéter Cuello en V - Colección Invierno', 'sueter_v_v1.hcd', 450, '7.2', 'Lana Merino 2/28', '12G'),
  ('Cardigan Trenzado - Mujer', 'cardigan_trenza.hcd', 680, '6.5', 'Algodón Peinado', '10G');

-- Conos iniciales
INSERT INTO yarn_cones (code, brand, color, weight_grams, stock_cones, min_stock_cones, supplier)
VALUES 
  ('MCH-001', 'Michell', 'Crema Natural', 200, 12, 5, 'Michell & Cía'),
  ('INC-001', 'Inca Tops', 'Negro Natural', 250, 3, 5, 'Inca Tops SAC');
