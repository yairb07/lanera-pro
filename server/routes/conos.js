import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const conoSchema = z.object({
  code: z.string().trim().min(2).max(50),
  brand: z.string().trim().max(100).optional(),
  color: z.string().trim().min(2).max(100),
  material: z.string().trim().max(100).optional(),
  weight_grams: z.number().positive(),
  stock_cones: z.number().nonnegative().default(0),
  min_stock_cones: z.number().nonnegative().default(0),
  supplier: z.string().trim().max(150).optional(),
  unit_price: z.number().nonnegative().default(0),
});

const movimientoStockSchema = z.object({
  tipo: z.enum(['entrada', 'salida', 'ajuste']),
  cantidad: z.number().positive(),
  motivo: z.string().trim().max(255).optional(),
});

// GET /api/conos - Listar inventario de conos
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM yarn_cones ORDER BY code ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/conos/movimientos - Listar historial de movimientos
router.get('/movimientos', requireAuth, async (req, res, next) => {
  try {
    const result = await query(`
      SELECT m.*, c.code, c.brand, c.color 
      FROM inventory_movements m
      JOIN yarn_cones c ON m.cone_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/conos - Registrar un tipo nuevo de cono
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = conoSchema.parse(req.body);
    const result = await query(
      `INSERT INTO yarn_cones (code, brand, color, material, weight_grams, stock_cones, min_stock_cones, supplier, unit_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.code, data.brand || null, data.color, data.material || null, data.weight_grams, data.stock_cones, data.min_stock_cones, data.supplier || null, data.unit_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos de cono inválidos.', errors: error.issues });
    }
    next(error);
  }
});

// POST /api/conos/:id/movimiento - Entrada/Salida/Ajuste rápido de stock (Con transacciones y logs de inventario)
router.post('/:id/movimiento', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, cantidad, motivo } = movimientoStockSchema.parse(req.body);

    // Obtener cono actual
    const conoRes = await query('SELECT stock_cones FROM yarn_cones WHERE id = $1', [id]);
    if (conoRes.rows.length === 0) {
      return res.status(404).json({ message: 'Cono no encontrado.' });
    }

    const stockAntes = Number(conoRes.rows[0].stock_cones);
    let stockDespues = stockAntes;

    if (tipo === 'entrada') stockDespues += cantidad;
    else if (tipo === 'salida') stockDespues = Math.max(0, stockAntes - cantidad);
    else if (tipo === 'ajuste') stockDespues = cantidad;

    // Actualizar stock e insertar log de movimiento usando queries directas
    await query('UPDATE yarn_cones SET stock_cones = $1, updated_at = NOW() WHERE id = $2', [stockDespues, id]);
    
    await query(
      `INSERT INTO inventory_movements (cone_id, movement_type, quantity_cones, stock_before, stock_after, reason, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, tipo, cantidad, stockAntes, stockDespues, motivo || 'Movimiento rápido desde Kardex', req.user.id]
    );

    res.json({ success: true, stock_after: stockDespues });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos de movimiento inválidos.', errors: error.issues });
    }
    next(error);
  }
});

export default router;
