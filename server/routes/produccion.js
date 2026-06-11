import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const registroProduccionSchema = z.object({
  employee_id: z.string().uuid(),
  garment_id: z.string().uuid(),
  cone_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  grams_per_unit: z.number().positive(),
});

// GET /api/produccion - Historial de producción de hoy
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*, e.full_name as empleado_nombre, g.name as prenda_nombre, c.color as cono_color
       FROM production_records p
       JOIN employees e ON p.employee_id = e.id
       JOIN garments g ON p.garment_id = g.id
       JOIN yarn_cones c ON p.cone_id = c.id
       WHERE p.created_at::date = CURRENT_DATE
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/produccion - Registrar producción con descuento automático de inventario (Transaccional)
router.post('/', requireAuth, async (req, res) => {
  const client = await pool.connect(); // Abrimos conexión dedicada para la transacción
  try {
    const data = registroProduccionSchema.parse(req.body);
    const totalGramos = data.quantity * data.grams_per_unit;

    await client.query('BEGIN'); // Inicio de Transacción

    // 1. Obtener los datos del cono de hilo para saber su peso base
    const conoRes = await client.query('SELECT color, weight_grams, stock_cones FROM yarn_cones WHERE id = $1 FOR UPDATE', [data.cone_id]);
    if (conoRes.rows.length === 0) {
      throw new Error('El cono de hilo seleccionado no existe.');
    }

    const cono = conoRes.rows[0];
    const gramosPorCono = Number(cono.weight_grams) || 1000;
    const conosUsados = totalGramos / gramosPorCono;
    const stockAntes = Number(cono.stock_cones);
    const stockDespues = Math.max(0, stockAntes - conosUsados);

    // 2. Descontar el stock en la tabla de conos
    await client.query('UPDATE yarn_cones SET stock_cones = $1, updated_at = NOW() WHERE id = $2', [stockDespues, data.cone_id]);

    // 3. Crear el registro de producción
    const prodRes = await client.query(
      `INSERT INTO production_records (employee_id, garment_id, cone_id, quantity, grams_per_unit, total_grams, cones_used, registered_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.employee_id, data.garment_id, data.cone_id, data.quantity, data.grams_per_unit, totalGramos, conosUsados, req.user.id]
    );

    // 4. Crear el log en el historial de movimientos del Kardex
    await client.query(
      `INSERT INTO inventory_movements (cone_id, production_record_id, movement_type, quantity_cones, stock_before, stock_after, reason, created_by)
       VALUES ($1, $2, 'salida', $3, $4, $5, $6, $7)`,
      [data.cone_id, prodRes.rows[0].id, conosUsados, stockAntes, stockDespues, `Consumo por producción de ${data.quantity} un.`, req.user.id]
    );

    await client.query('COMMIT'); // Guardamos de forma permanente todos los cambios si no hubo errores
    res.status(201).json({ success: true, record: prodRes.rows[0], nuevo_stock_conos: stockDespues });

  } catch (error) {
    await client.query('ROLLBACK'); // Cancelamos todo si algo falló para proteger la base de datos
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos de registro de producción inválidos.', errors: error.issues });
    }
    res.status(500).json({ message: error.message || 'Error en la transacción de producción.' });
  } finally {
    client.release(); // Devolvemos la conexión al pool
  }
});

export default router;