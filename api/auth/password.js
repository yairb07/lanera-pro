import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../_shared/db.js';
import { getCurrentUser } from '../_shared/auth.js';
import { handleApiError, methodNotAllowed, withConfig } from '../_shared/http.js';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(8).max(200),
  newPassword: z.string().min(8).max(200),
});

export default withConfig(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: 'No autenticado.' });
    }

    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la actual.' });
    }

    const result = await query(
      `select password_hash from app_users where id = $1 and is_active = true`,
      [user.id],
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
      [passwordHash, user.id],
    );

    return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    return handleApiError(res, error);
  }
});
