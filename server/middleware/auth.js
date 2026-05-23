import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { query } from '../db.js';

const COOKIE_NAME = 'lanera_session';

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '8h' },
  );
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure,
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure,
  });
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: 'No autenticado.' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const result = await query(
      `select id, username, full_name, role, employee_id
       from app_users
       where id = $1 and is_active = true`,
      [payload.sub],
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Sesion invalida.' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Sesion invalida.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta accion.' });
    }

    next();
  };
}
