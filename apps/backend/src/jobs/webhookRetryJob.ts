/**
 * GLUP — Job de reintentos automáticos de webhook n8n
 *
 * Diseño:
 *   - setInterval nativo (cero dependencias extra)
 *   - Un solo ciclo activo a la vez (guard _corriendo)
 *   - Procesamiento secuencial con pausa entre registros (no saturar n8n)
 *   - Cap configurable de intentos por registro (RETRY_MAX_INTENTOS)
 *   - Graceful shutdown: devuelve función de limpieza
 *
 * Ciclo de vida de un registro en la BD:
 *
 *   PENDIENTE ──► notificarN8n() OK ──────────────► ENVIADO
 *       │
 *       └──► notificarN8n() ERR ──► incremento ──► FALLIDO (reintento)
 *                                        │
 *                                        └─ intentos ≥ MAX ──► FALLIDO (permanente)
 */

import {
  buscarParaReintento,
  actualizarEstadoWebhook,
  incrementarIntentos,
  type TriajeRecord,
} from '../models/triaje';
import { decrypt } from '../utils/crypto';
import { notificarN8n, type N8nRetryPayload } from '../services/webhookService';

// ─── Configuración ────────────────────────────────────────────────────────────

const MAX_INTENTOS   = parseInt(process.env.RETRY_MAX_INTENTOS ?? '5',            10);
const INTERVALO_MS   = parseInt(process.env.RETRY_INTERVAL_MS  ?? String(5 * 60_000), 10);
const DELAY_ENTRE_MS = 800; // pausa entre registros para no saturar n8n

// ─── Estado interno ───────────────────────────────────────────────────────────

let _corriendo = false; // evita ciclos solapados si el intervalo dispara antes de terminar

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildRetryPayload(
  record: TriajeRecord,
  nombre:   string,
  whatsapp: string,
): N8nRetryPayload {
  return {
    nombre,
    whatsapp,
    semaforo:       record.semaforo,
    imc:            record.imc,
    session_id:     record.id,
    timestamp:      new Date().toISOString(),
    es_reintento:   true,
    intento_numero: record.intentos + 1,
  };
}

// ─── Procesamiento de un registro ────────────────────────────────────────────

type ResultadoReintento = 'enviado' | 'fallido' | 'agotado' | 'error_descifrado';

async function procesarRegistro(record: TriajeRecord): Promise<ResultadoReintento> {
  // ── Guard: máximo de intentos alcanzado ────────────────────────────────────
  if (record.intentos >= MAX_INTENTOS) {
    return 'agotado';
  }

  // ── Descifrar datos de contacto ────────────────────────────────────────────
  let nombre: string;
  let whatsapp: string;

  try {
    nombre   = decrypt(record.nombre_enc);
    whatsapp = decrypt(record.whatsapp_enc);
  } catch (err) {
    // Error de cifrado o datos corruptos — no tiene sentido reintentar
    const msg = `DECRYPT_ERROR: ${(err as Error).message}`;
    incrementarIntentos(record.id, msg);
    console.error(`[GLUP Retry] Error de descifrado en sesión ${record.id}:`, msg);
    return 'error_descifrado';
  }

  // ── Enviar webhook ─────────────────────────────────────────────────────────
  const payload = buildRetryPayload(record, nombre, whatsapp);

  try {
    await notificarN8n(payload);
    actualizarEstadoWebhook(record.id, 'ENVIADO');
    console.info(
      `[GLUP Retry] ENVIADO — sesión ${record.id} | ` +
      `semáforo ${record.semaforo} | intento #${record.intentos + 1}`,
    );
    return 'enviado';
  } catch (err) {
    const msg = (err as Error).message;
    incrementarIntentos(record.id, msg);
    console.warn(
      `[GLUP Retry] FALLIDO — sesión ${record.id} | ` +
      `intento #${record.intentos + 1}/${MAX_INTENTOS} | ${msg}`,
    );
    return 'fallido';
  }
}

// ─── Ciclo principal ──────────────────────────────────────────────────────────

async function ejecutarCiclo(): Promise<void> {
  if (_corriendo) {
    console.warn('[GLUP Retry] Ciclo anterior aún activo. Saltando esta ejecución.');
    return;
  }

  _corriendo = true;

  try {
    const pendientes = buscarParaReintento(MAX_INTENTOS);

    if (pendientes.length === 0) return; // nada que hacer, salir silenciosamente

    console.info(`[GLUP Retry] Iniciando ciclo: ${pendientes.length} registro(s) pendiente(s).`);

    const conteo = { enviados: 0, fallidos: 0, agotados: 0, errores: 0 };

    for (let i = 0; i < pendientes.length; i++) {
      const resultado = await procesarRegistro(pendientes[i]);

      switch (resultado) {
        case 'enviado':          conteo.enviados++;  break;
        case 'fallido':          conteo.fallidos++;  break;
        case 'agotado':          conteo.agotados++;  break;
        case 'error_descifrado': conteo.errores++;   break;
      }

      // Pausa entre registros (no tras el último)
      if (i < pendientes.length - 1) await sleep(DELAY_ENTRE_MS);
    }

    console.info(
      `[GLUP Retry] Ciclo completado — ` +
      `${conteo.enviados} enviados, ` +
      `${conteo.fallidos} fallidos, ` +
      `${conteo.agotados} agotados (≥${MAX_INTENTOS} intentos), ` +
      `${conteo.errores} errores de descifrado.`,
    );
  } finally {
    _corriendo = false;
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Inicia el job de reintentos automáticos con setInterval.
 * El timer usa `.unref()` para no bloquear el cierre del proceso.
 *
 * @returns Función de limpieza — llamar en el shutdown del servidor.
 *
 * @example
 * ```ts
 * const detener = iniciarRetryJob();
 * process.on('SIGTERM', detener);
 * ```
 */
export function iniciarRetryJob(): () => void {
  console.info(
    `[GLUP Retry] Job iniciado — ` +
    `intervalo: ${INTERVALO_MS / 60_000} min | ` +
    `máx. intentos por registro: ${MAX_INTENTOS}.`,
  );

  const timer = setInterval(async () => {
    try {
      await ejecutarCiclo();
    } catch (err) {
      // Captura cualquier error no manejado dentro del ciclo
      console.error('[GLUP Retry] Error crítico inesperado:', (err as Error).message);
    }
  }, INTERVALO_MS);

  // No mantener el event-loop vivo solo por este timer
  timer.unref();

  return () => {
    clearInterval(timer);
    console.info('[GLUP Retry] Job detenido correctamente.');
  };
}
