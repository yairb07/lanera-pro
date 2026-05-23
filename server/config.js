import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  jwtSecret: process.env.JWT_SECRET,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
};

export function assertConfig() {
  const missing = [];

  if (!config.databaseUrl) missing.push('DATABASE_URL o POSTGRES_URL');
  if (!config.jwtSecret || config.jwtSecret.length < 32) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno seguras: ${missing.join(', ')}`);
  }
}
