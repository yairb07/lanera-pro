import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Schema de validación para nuevos empleados
const empleadoSchema = z.object({
  full_name: z.string().trim().min(3).max(100),
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
  try {
    const data = empleadoSchema.parse(req.body);
    const result = await query(
      `INSERT INTO employees (full_name, job_role, shift, payment_type, base_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, job_role, shift, payment_type, base_amount, status`,
      [data.full_name, data.job_role, data.shift || null, data.payment_type, data.base_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos de empleado inválidos.', errors: error.issues });
    }
    next(error);
  }
});

export default router;