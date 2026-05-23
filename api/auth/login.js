import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../_shared/db.js';
import { setSessionCookie } from '../_shared/cookies.js';
import { serializeUser, signSession } from '../_shared/auth.js';
import { handleApiError, methodNotAllowed, withConfig } from '../_shared/http.js';

const loginSchema = z.object({
  username: z.string().trim().min(3).max(80),
  password: z.string().min(8).max(200),
});

export default withConfig(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

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

    setSessionCookie(res, signSession(user));
    return res.status(200).json({ user: serializeUser(user) });
  } catch (error) {
    return handleApiError(res, error);
  }
});
