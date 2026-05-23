export const config = {
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  jwtSecret: process.env.JWT_SECRET,
  cookieSecure: process.env.COOKIE_SECURE !== 'false',
};

export function assertApiConfig() {
  const missing = [];

  if (!config.databaseUrl) missing.push('DATABASE_URL o POSTGRES_URL');
  if (!config.jwtSecret || config.jwtSecret.length < 32) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }
}
