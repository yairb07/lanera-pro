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

const changePasswordSchema = z.object({
  oldPassword: z.string().min(8).max(200),
  newPassword: z.string().min(8).max(200),
});

router.post('/password', requireAuth, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la actual.' });
    }

    const result = await query(
      `select password_hash from app_users where id = $1 and is_active = true`,
      [req.user.id],
    );

    const stored = result.rows[0];
    if (!stored) {
      return res.status(401).json({ message: 'Sesion invalida.' });
    }

    const isValid = await bcrypt.compare(oldPassword, stored.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query(
      `update app_users set password_hash = $1 where id = $2`,
      [passwordHash, req.user.id],
    );

    return res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos invalidos.', errors: error.issues });
    }

    next(error);
  }
});

export default router;
