import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { assertConfig, config } from './config.js';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';

assertConfig();

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontendOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('select 1');
    res.json({ ok: true, service: 'taller-textil-api' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.use((error, _req, res, next) => {
  void next;
  console.error(error);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

app.listen(config.port, () => {
  console.log(`Taller Textil API escuchando en http://localhost:${config.port}`);
});
