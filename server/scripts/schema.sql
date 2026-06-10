-- ==============================================================================
-- TALLER TEXTIL - Esquema de Base de Datos (PostgreSQL)
-- ==============================================================================

-- 1. Tabla de Empleados
CREATE TABLE IF NOT EXISTS empleados (
  id VARCHAR(50) PRIMARY KEY, -- Ej: emp_1, emp_17000000
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  turno VARCHAR(50) NOT NULL,
  pago VARCHAR(50) NOT NULL, -- 'destajo' o 'sueldo'
  estado VARCHAR(20) DEFAULT 'activo',
  prendas_tejidas INTEGER DEFAULT 0,
  monto_ganado DECIMAL(10, 2) DEFAULT 0.00,
  tareas_activas INTEGER DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Catálogo de Prendas (Diseños)
CREATE TABLE IF NOT EXISTS prendas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  imagen_url TEXT,
  archivo_programa VARCHAR(150) NOT NULL, -- Ej: sueter_v_v1.hcd
  vueltas INTEGER DEFAULT 0,
  tension VARCHAR(50),
  hilo_tipo VARCHAR(100),
  aguja VARCHAR(50),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Conos (Inventario unificado para Kardex y Producción)
CREATE TABLE IF NOT EXISTS conos (
  id VARCHAR(50) PRIMARY KEY, -- Ej: MCH-001, INC-002
  marca VARCHAR(100) NOT NULL,
  color VARCHAR(100) NOT NULL,
  codigo_interno VARCHAR(50),
  peso_por_cono VARCHAR(50) DEFAULT '1000g',
  peso_gramos INTEGER DEFAULT 1000, -- Peso numérico para cálculos matemáticos
  proveedor VARCHAR(150),
  stock DECIMAL(10, 2) DEFAULT 0,
  stock_minimo DECIMAL(10, 2) DEFAULT 5,
  precio_unitario DECIMAL(10, 2) DEFAULT 0.00,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Producción (Registro diario de las máquinas)
CREATE TABLE IF NOT EXISTS produccion (
  id SERIAL PRIMARY KEY,
  empleado_id VARCHAR(50) REFERENCES empleados(id) ON DELETE SET NULL,
  prenda_tipo VARCHAR(150) NOT NULL, -- Nombre de la prenda (relacionado visualmente a prendas)
  cono_usado_id VARCHAR(50) REFERENCES conos(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  gramaje_por_prenda INTEGER NOT NULL,
  total_gramos INTEGER NOT NULL,
  conos_descontados DECIMAL(10, 2) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Movimientos de Kardex (Historial de Entradas, Salidas y Ajustes)
CREATE TABLE IF NOT EXISTS movimientos_kardex (
  id SERIAL PRIMARY KEY,
  cono_id VARCHAR(50) REFERENCES conos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'ajuste'
  cantidad DECIMAL(10, 2) NOT NULL,
  stock_anterior DECIMAL(10, 2) NOT NULL,
  stock_nuevo DECIMAL(10, 2) NOT NULL,
  motivo TEXT,
  fecha_movimiento DATE NOT NULL DEFAULT CURRENT_DATE,
  hora_movimiento TIME NOT NULL DEFAULT CURRENT_TIME,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATOS INICIALES (Semilla / Seed)
-- ==============================================================================

-- Empleados iniciales
INSERT INTO empleados (id, nombre, rol, turno, pago, prendas_tejidas, monto_ganado, estado)
VALUES 
  ('emp_1', 'Maria Lopez', 'Tejedora', 'Mañana', 'destajo', 0, 0, 'activo'),
  ('emp_2', 'Juan Perez', 'Tejedora', 'Tarde', 'sueldo', 0, 1200, 'activo')
ON CONFLICT (id) DO NOTHING;

-- Prendas iniciales
INSERT INTO prendas (id, nombre, imagen_url, archivo_programa, vueltas, tension, hilo_tipo, aguja)
VALUES 
  (1, 'Suéter Cuello en V - Colección Invierno', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop', 'sueter_v_v1.hcd', 450, '7.2', 'Lana Merino 2/28', '12G'),
  (2, 'Cardigan Trenzado - Mujer', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1170&auto=format&fit=crop', 'cardigan_trenza.hcd', 680, '6.5', 'Algodón Peinado', '10G')
ON CONFLICT (id) DO NOTHING;

-- Conos iniciales
INSERT INTO conos (id, marca, color, codigo_interno, peso_por_cono, peso_gramos, proveedor, stock, stock_minimo)
VALUES 
  ('MCH-001', 'Michell', 'Crema Natural', 'CN-01', '200g', 200, 'Michell & Cía', 12, 5),
  ('MCH-002', 'Michell', 'Gris Perla', 'GP-03', '200g', 200, 'Michell & Cía', 8, 3),
  ('INC-001', 'Inca Tops', 'Negro Natural', 'NN-07', '250g', 250, 'Inca Tops SAC', 3, 5),
  ('INC-002', 'Inca Tops', 'Marrón Café', 'MC-12', '250g', 250, 'Inca Tops SAC', 20, 8)
ON CONFLICT (id) DO NOTHING;
