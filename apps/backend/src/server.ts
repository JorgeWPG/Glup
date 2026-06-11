import 'dotenv/config';
import app from './app';
import { iniciarRetryJob } from './jobs/webhookRetryJob';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

// ── Arrancar servidor HTTP ────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`[GLUP Backend] Servidor escuchando en http://localhost:${PORT}`);
  console.log(`[GLUP Backend] Entorno: ${process.env.NODE_ENV ?? 'development'}`);
});

// ── Iniciar job de reintentos DESPUÉS de que el servidor esté listo ───────────
// El job arranca con setInterval y no bloquea el event-loop (.unref() interno).
const detenerRetryJob = iniciarRetryJob();

// ── Graceful shutdown ─────────────────────────────────────────────────────────
function gracefulShutdown(signal: string): void {
  console.info(`\n[GLUP] Señal ${signal} recibida. Iniciando cierre ordenado...`);

  // 1. Detener el job de reintentos (no nuevos ciclos)
  detenerRetryJob();

  // 2. Cerrar el servidor HTTP (no acepta nuevas conexiones, espera las activas)
  server.close(() => {
    console.info('[GLUP] Servidor HTTP cerrado. Proceso terminado correctamente.');
    process.exit(0);
  });

  // 3. Forzar salida si alguna conexión activa tarda más de 10 s
  setTimeout(() => {
    console.error('[GLUP] Timeout de cierre (10 s). Saliendo forzosamente.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Docker / Railway
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));  // Ctrl+C en desarrollo
