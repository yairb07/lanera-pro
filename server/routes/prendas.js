import express from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/prendas/categorias
// Obtener todas las categorias
router.get('/categorias', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM garment_categories ORDER BY created_at ASC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/prendas/categorias
// Crear una nueva categoria
router.post('/categorias', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
    }

    const { rows } = await pool.query(
      'INSERT INTO garment_categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
      [name]
    );

    if (rows.length === 0) {
      // Si ya existía, la buscamos y devolvemos
      const existing = await pool.query('SELECT * FROM garment_categories WHERE name = $1', [name]);
      return res.status(200).json(existing.rows[0]);
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /api/prendas
// Obtener prendas. Admin ve todo. Empleados filtran según su permiso personal.
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { role, employee_id } = req.user;
    let filterQuery = '';

    if (role === 'employee' && employee_id) {
      // Leer permiso individual del empleado
      const empRes = await pool.query(
        'SELECT permisos_catalogo FROM employees WHERE id = $1',
        [employee_id]
      );
      const permiso = empRes.rows[0]?.permisos_catalogo || 'todos';

      if (permiso === 'manuales') {
        filterQuery = "WHERE p.machine_type = 'manual'";
      } else if (permiso === 'computarizadas') {
        filterQuery = "WHERE p.machine_type = 'computarizada'";
      }
      // 'todos' = sin filtro
    }
    // Admin: filterQuery queda vacío, ve todo

    const { rows } = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM garments p
      LEFT JOIN garment_categories c ON p.category_id = c.id
      ${filterQuery}
      ORDER BY p.is_favorite DESC, p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/prendas
// Crear una prenda nueva
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { name, category, image_url, file_program, laps, tension, yarn_type, needle, machine_type, pattern_reference, manual_tension } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Falta el nombre del diseño' });
    }

    // Buscar el ID de la categoría por su nombre
    let category_id = null;
    if (category) {
      const catRes = await client.query('SELECT id FROM garment_categories WHERE name = $1', [category]);
      if (catRes.rows.length > 0) {
        category_id = catRes.rows[0].id;
      }
    }

    const query = `
      INSERT INTO garments (name, category_id, image_url, file_program, laps, tension, yarn_type, needle, machine_type, pattern_reference, manual_tension)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      name,
      category_id,
      image_url || null,
      file_program || 'sin_programa.hcd',
      parseInt(laps) || 0,
      tension || '',
      yarn_type || '',
      needle || '',
      machine_type || 'computarizada',
      pattern_reference || null,
      manual_tension || ''
    ];

    const { rows } = await client.query(query, values);
    
    // Devolver la prenda junto con el nombre de su categoría
    const newGarment = { ...rows[0], category_name: category };
    
    await client.query('COMMIT');
    res.status(201).json(newGarment);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// PATCH /api/prendas/:id
// Editar una prenda
router.patch('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { name, category, image_url, file_program, laps, tension, yarn_type, needle, machine_type, pattern_reference, manual_tension } = req.body;

    let category_id = null;
    if (category) {
      const catRes = await client.query('SELECT id FROM garment_categories WHERE name = $1', [category]);
      if (catRes.rows.length > 0) category_id = catRes.rows[0].id;
    }

    const { rows } = await client.query(`
      UPDATE garments
      SET name=$1, category_id=$2, image_url=$3, file_program=$4, laps=$5, tension=$6, yarn_type=$7, needle=$8, machine_type=$9, pattern_reference=$10, manual_tension=$11
      WHERE id=$12 RETURNING *
    `, [name, category_id, image_url, file_program, parseInt(laps)||0, tension, yarn_type, needle, machine_type || 'computarizada', pattern_reference, manual_tension, id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Prenda no encontrada' });

    const catName = await client.query('SELECT name FROM garment_categories WHERE id=$1', [rows[0].category_id]);
    await client.query('COMMIT');
    res.json({ ...rows[0], category_name: catName.rows[0]?.name || 'General' });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// DELETE /api/prendas/:id
// Eliminar una prenda
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM garments WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Prenda no encontrada' });
    }
    res.json({ message: 'Prenda eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/prendas/:id/favorite
// Alternar el estado de favorito de una prenda
router.patch('/:id/favorite', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_favorite } = req.body;
    const { rows } = await pool.query(
      'UPDATE garments SET is_favorite = $1 WHERE id = $2 RETURNING *',
      [is_favorite, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Prenda no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
