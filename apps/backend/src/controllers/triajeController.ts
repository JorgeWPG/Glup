import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { TriajeSchema } from '@glup/shared';
import { calcularSemaforo, ScoreResult } from '../services/scoringService';
import { encrypt } from '../utils/crypto';
import { guardarTriaje, actualizarEstadoWebhook } from '../models/triaje';
import { notificarN8n, type N8nTriajePayload } from '../services/webhookService';

// ─── Schema extendido — datos de contacto del lead ───────────────────────────

const LeadSchema = z.object({
  nombre:   z.string().min(2).max(100).trim(),
  whatsapp: z.string().regex(
    /^9\d{8}$/,
    'Número celular peruano inválido (9 dígitos, empieza en 9)',
  ),
});

const TriajeConLeadSchema = TriajeSchema.merge(LeadSchema);
type TriajeConLead = z.infer<typeof TriajeConLeadSchema>;

// ─── Construcción del payload ─────────────────────────────────────────────────

function construirPayloadN8n(
  datos:     TriajeConLead,
  score:     ScoreResult,
  sessionId: string,
  timestamp: string,
): N8nTriajePayload {
  return {
    nombre:    datos.nombre,
    whatsapp:  `51${datos.whatsapp}`, // E.164 con código de país Perú
    semaforo:  score.semaforo,
    imc:       score.imc,
    session_id: sessionId,
    timestamp,
    respuestas_clave: {
      comorbilidades:              datos.p3_comorbilidades,
      tiempo_sobrepeso:            datos.p4_tiempoSobrepeso,
      contraindicacion_oncologica: datos.p5_contraindicacion_oncologica,
      embarazo_lactancia:          datos.p6_embarazo_lactancia,
      tca_activo:                  datos.p7_tca_activo,
      food_noise:                  datos.p8_food_noise,
      intentos_previos:            datos.p9_intentos_previos,
      medicacion_actual:           datos.p10_medicacion_actual,
    },
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * POST /api/v1/triaje
 *
 * Flujo de resiliencia de 5 pasos:
 *
 *  1. Validar payload (10 preguntas + nombre + whatsapp).
 *  2. Calcular semáforo e IMC.
 *  3. Persistir en SQLite con contacto cifrado (AES-256-GCM) → PENDIENTE.
 *  4. Responder al cliente de inmediato (no espera al webhook).
 *  5. Async post-response: disparar webhook n8n → actualizar ENVIADO/FALLIDO.
 *
 * Si el webhook falla, el registro queda FALLIDO y el webhookRetryJob
 * lo reintentará cada 5 min (hasta RETRY_MAX_INTENTOS veces).
 *
 * Ley 29733: la respuesta nunca incluye nombre, whatsapp ni datos biométricos.
 */
export async function procesarTriaje(req: Request, res: Response): Promise<void> {
  // ── 1. Validación ──────────────────────────────────────────────────────────
  const parsed = TriajeConLeadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(422).json({
      ok:     false,
      error:  'Datos del triaje inválidos. Revisa los campos enviados.',
      campos: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { nombre, whatsapp, ...triajeData } = parsed.data;

  // ── 2. Cálculo ─────────────────────────────────────────────────────────────
  const score     = calcularSemaforo(triajeData);
  const sessionId = uuidv4();
  const timestamp = new Date().toISOString();

  // ── 3. Persistencia (síncrona, ~1 ms con better-sqlite3) ──────────────────
  let persistido = false;
  try {
    guardarTriaje({
      id:             sessionId,
      semaforo:       score.semaforo,
      imc:            score.imc,
      nombre_enc:     encrypt(nombre),
      whatsapp_enc:   encrypt(whatsapp),
      estado_webhook: 'PENDIENTE',
      created_at:     timestamp,
    });
    persistido = true;
  } catch (dbErr) {
    console.error(
      `[GLUP DB] Error al persistir triaje (${sessionId}):`,
      (dbErr as Error).message,
    );
  }

  // ── 4. Respuesta inmediata al cliente ──────────────────────────────────────
  res.status(200).json({
    ok:       true,
    sessionId,
    semaforo: score.semaforo,
    imc:      score.imc,
    timestamp,
  });

  // ── 5. Webhook n8n (fire & forget, post-response) ─────────────────────────
  const payload = construirPayloadN8n(parsed.data, score, sessionId, timestamp);

  notificarN8n(payload)
    .then(() => {
      if (persistido) actualizarEstadoWebhook(sessionId, 'ENVIADO');
      console.info(`[GLUP n8n] Webhook OK — ${sessionId} | ${score.semaforo}`);
    })
    .catch((err: Error) => {
      console.error(`[GLUP n8n] Webhook FALLIDO — ${sessionId} | ${score.semaforo}:`, err.message);
      if (persistido) actualizarEstadoWebhook(sessionId, 'FALLIDO');
    });
}
