import 'dotenv/config';
import { pool } from './server/db.js';
import bcrypt from 'bcryptjs';

async function createEmployee() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const fullName = 'yehiner becerra';
    const dni = '73425576';
    const jobRole = 'Confección';
    const paymentType = 'piecework';

    const empResult = await client.query(
      `INSERT INTO employees (full_name, dni, job_role, payment_type, base_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [fullName, dni, jobRole, paymentType, 0]
    );
    const newEmployee = empResult.rows[0];

    const firstName = fullName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const dniSuffix = dni.slice(-4);
    const username = `${firstName}.${dniSuffix}`;
    const passwordHash = await bcrypt.hash(dni, 10);

    await client.query(
      `INSERT INTO app_users (username, password_hash, full_name, role, employee_id, is_active)
       VALUES ($1, $2, $3, 'employee', $4, true)`,
      [username, passwordHash, fullName, newEmployee.id]
    );

    await client.query('COMMIT');
    console.log(`CREADO_EXITOSAMENTE|Usuario: ${username}|Contraseña: ${dni}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err.message);
  } finally {
    client.release();
    process.exit(0);
  }
}
createEmployee();
