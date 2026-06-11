import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import triajeRouter from './routes/triaje';

const app: Application = express();

// ── Seguridad de cabeceras HTTP ──────────────────────────────────────────────
app.use(helmet());

// ── CORS: solo el origen del frontend autorizado ─────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
  }),
);

// ── Parseo JSON con límite de payload (previene ataques de body gigante) ──────
app.use(express.json({ limit: '10kb' }));

// ── Rate limiting: máx. 20 peticiones por IP cada 15 minutos en /api/ ────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/', apiLimiter);

// ── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/v1/triaje', triajeRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'glup-backend' });
});

// ── Manejador de rutas no encontradas ────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// ── Manejador de errores no controlados ──────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[GLUP Error]', err.message);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

export default app;
