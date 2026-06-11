/**
 * GLUP — Servicio de webhook n8n
 *
 * Centraliza los tipos de payload y la llamada HTTP para que tanto
 * el controller (primer intento) como el webhookRetryJob (reintentos)
 * usen exactamente la misma lógica de envío.
 */

import type { Semaforo } from '../models/triaje';

// ─── Tipos de payload ─────────────────────────────────────────────────────────

interface N8nBase {
  nombre:     string;
  whatsapp:   string; // E.164: "51" + 9 dígitos
  semaforo:   Semaforo;
  imc:        number;
  session_id: string;
  timestamp:  string;
}

/** Payload del primer intento — incluye las respuestas del test. */
export interface N8nTriajePayload extends N8nBase {
  respuestas_clave: {
    comorbilidades:              boolean;
    tiempo_sobrepeso:            string;
    contraindicacion_oncologica: boolean;
    embarazo_lactancia:          boolean;
    tca_activo:                  boolean;
    food_noise:                  number;
    intentos_previos:            boolean;
    medicacion_actual:           boolean;
  };
}

/** Payload de reintento — sin respuestas del test (no se persisten), con metadatos de reintento. */
export interface N8nRetryPayload extends N8nBase {
  es_reintento:   true;
  intento_numero: number;
}

export type N8nPayload = N8nTriajePayload | N8nRetryPayload;

// ─── Envío HTTP ───────────────────────────────────────────────────────────────

/**
 * Dispara el webhook n8n con el payload dado.
 * Lanza un error si:
 *   - La URL de n8n respondió con HTTP != 2xx.
 *   - El fetch supera el timeout de 8 s.
 * Si N8N_WEBHOOK_URL no está configurada, retorna silenciosamente.
 */
export async function notificarN8n(payload: N8nPayload): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;

  const secret = process.env.N8N_WEBHOOK_SECRET ?? '';

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'X-GLUP-Secret': secret } : {}),
    },
    body:   JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    throw new Error(`n8n respondió HTTP ${res.status} ${res.statusText}`);
  }
}
