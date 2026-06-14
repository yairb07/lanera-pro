import express from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/ajustes
// Obtener todos los ajustes configurados
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT clave, valor FROM ajustes');
    const configMap = {};
    rows.forEach(r => {
      configMap[r.clave] = r.valor;
    });
    res.json(configMap);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/ajustes
// Actualizar o crear un ajuste. Solo administradores.
router.patch('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { clave, valor } = req.body;
    if (!clave || valor === undefined) {
      return res.status(400).json({ message: 'La clave y el valor son obligatorios.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO ajustes (clave, valor)
       VALUES ($1, $2)
       ON CONFLICT (clave)
       DO UPDATE SET valor = EXCLUDED.valor
       RETURNING *`,
      [clave, valor]
    );

    res.json({ message: 'Ajuste actualizado correctamente.', ajuste: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
