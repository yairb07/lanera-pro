import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { query } from './db.js';
import { getSessionToken } from './cookies.js';

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '8h' },
  );
}

export function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.full_name,
    role: user.role,
    employeeId: user.employee_id,
  };
}

export async function getCurrentUser(req) {
  const token = getSessionToken(req);

  if (!token) return null;

  const payload = jwt.verify(token, config.jwtSecret);
  const result = await query(
    `select id, username, full_name, role, employee_id
     from app_users
     where id = $1 and is_active = true`,
    [payload.sub],
  );

  return result.rows[0] || null;
}
