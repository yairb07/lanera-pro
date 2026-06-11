import 'dotenv/config';
import { query } from './server/db.js';
import bcrypt from 'bcryptjs';

async function test() {
  try {
    const result = await query(
      `select id, username, password_hash, full_name, role, employee_id
       from app_users
       where username = $1 and is_active = true`,
      ['flor.cholan'],
    );
    const user = result.rows[0];
    console.log('User found:', user);

    if (user) {
       const isValid = await bcrypt.compare('12345678', user.password_hash);
       console.log('Password valid:', isValid);
    }
  } catch(e) {
    console.error('DB Error:', e);
  }
}
test();
