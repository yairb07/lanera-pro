import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db.js';
import { clearSessionCookie, requireAuth, setSessionCookie, signSession } from '../middleware/auth.js';

const router = Router();

const loginSchema = z.object({
  username: z.string().trim().min(3).max(80),
  password: z.string().min(8).max(200),
});

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.full_name,
    role: user.role,
    employeeId: user.employee_id,
  };
}

router.post('/login', async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);

    const result = await query(
      `select id, username, password_hash, full_name, role, employee_id
       from app_users
       where username = $1 and is_active = true`,
      [credentials.username],
    );

    const user = result.rows[0];
    const isValid = user
      ? await bcrypt.compare(credentials.password, user.password_hash)
      : false;

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = signSession(user);
    setSessionCookie(res, token);

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos de login invalidos.', errors: error.issues });
    }

    next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

router.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

export default router;
