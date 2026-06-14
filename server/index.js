import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { assertConfig, config } from './config.js';
import { pool } from './db.js';

// Rutas importadas
import authRoutes from './routes/auth.js';
import empleadosRoutes from './routes/empleados.js';
import conosRoutes from './routes/conos.js';
import produccionRoutes from './routes/produccion.js';
import prendasRoutes from './routes/prendas.js'; // Nuevas
import ajustesRoutes from './routes/ajustes.js';

assertConfig();

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontendOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Ruta de Salud de la API
app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('select 1');
    res.json({ ok: true, service: 'lanera-pro-api' });
  } catch (error) {
    next(error);
  }
});

// Declaración de módulos de la API
app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/conos', conosRoutes);
app.use('/api/produccion', produccionRoutes);
app.use('/api/prendas', prendasRoutes);
app.use('/api/ajustes', ajustesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.use((error, _req, res, next) => {
  void next;
  console.error(error);
  res.status(500).json({ message: 'Error interno del servidor.', detail: error.message });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, () => {
    console.log(`LaneraPro API escuchando en http://localhost:${config.port}`);
  });
}

export default app;