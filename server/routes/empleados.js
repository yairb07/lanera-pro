import { Router } from 'express';
import { z } from 'zod';
import { pool, query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Schema de validación para nuevos empleados
const empleadoSchema = z.object({
  full_name: z.string().trim().min(3).max(100),
  dni: z.string().trim().min(8).max(20),
  job_role: z.string().trim().min(2).max(50),
  shift: z.string().trim().optional(),
  payment_type: z.enum(['salary', 'piecework']),
  base_amount: z.number().nonnegative().default(0),
});

// GET /api/empleados - Obtener todos los empleados (Protegido)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, full_name, job_role, shift, payment_type, base_amount, status FROM employees ORDER BY full_name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/empleados - Crear un empleado (Solo administradores)
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const data = empleadoSchema.parse(req.body);
    await client.query('BEGIN');

    // 1. Insertar en la tabla employees con el DNI
    const empResult = await client.query(
      `INSERT INTO employees (full_name, dni, job_role, shift, payment_type, base_amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, job_role, shift, payment_type, base_amount, status`,
      [data.full_name, data.dni, data.job_role, data.shift || null, data.payment_type, data.base_amount]
    );

    const newEmployee = empResult.rows[0];

    // 2. Generar credenciales
    // Usuario: primera palabra del nombre + "." + ultimos 4 del dni
    const firstName = data.full_name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const dniSuffix = data.dni.slice(-4);
    const username = `${firstName}.${dniSuffix}`;
    
    // Contraseña: DNI encriptado
    const passwordHash = await bcrypt.hash(data.dni, 10);

    // 3. Crear el usuario en app_users vinculado al empleado
    await client.query(
      `INSERT INTO app_users (username, password_hash, full_name, role, employee_id, is_active)
       VALUES ($1, $2, $3, 'employee', $4, true)`,
      [username, passwordHash, data.full_name, newEmployee.id]
    );

    await client.query('COMMIT');

    // Retornamos el empleado Y las credenciales autogeneradas en claro para mandarlas por WhatsApp
    res.status(201).json({
      empleado: newEmployee,
      credenciales: {
        usuario: username,
        password: data.dni
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos de empleado inválidos.', errors: error.issues });
    }
    // Handle unique violation for DNI
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El DNI o el empleado ya existe en el sistema.' });
    }
    next(error);
  } finally {
    client.release();
  }
});

// GET /api/empleados/roles - Obtener todos los roles
router.get('/roles', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM employee_roles ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/empleados/roles - Crear un nuevo rol (Solo admin)
router.post('/roles', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'El nombre del rol es obligatorio.' });
    }

    const { rows } = await pool.query(
      'INSERT INTO employee_roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
      [name]
    );

    if (rows.length === 0) {
      const existing = await pool.query('SELECT * FROM employee_roles WHERE name = $1', [name]);
      return res.status(200).json(existing.rows[0]);
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/empleados/roles/:id - Eliminar un rol (Solo admin)
router.delete('/roles/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM employee_roles WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }
    res.json({ message: 'Rol de empleado eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
});

export default router;