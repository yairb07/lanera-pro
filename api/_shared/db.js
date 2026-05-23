import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: { rejectUnauthorized: true },
    });
  }

  return pool;
}

export function query(text, params) {
  return getPool().query(text, params);
}
