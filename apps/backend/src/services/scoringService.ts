import { TriajeInput } from '@glup/shared';
import { ResultadoSemaforo } from '@glup/shared';

/** Umbral de food noise que se considera clínicamente alto (sobre escala 1-5) */
const FOOD_NOISE_ALTO = 4;

export interface ScoreResult {
  semaforo: ResultadoSemaforo;
  imc: number;
}

/**
 * Calcula el resultado del triaje metabólico GLUP según criterios clínicos.
 *
 * Lógica de semáforo (en orden de precedencia):
 *   ROJA     → contraindicación crítica activa, O IMC < 25
 *   VERDE    → IMC ≥ 30 sin contraindicaciones, O IMC ≥ 27 con comorbilidades
 *   AMARILLA → IMC 27–29.9 con comorbilidades O food noise alto (sin dx aún)
 *   ROJA     → IMC 25–26.9 sin condiciones calificantes (no candidato actual)
 */
export function calcularSemaforo(datos: TriajeInput): ScoreResult {
  const imc = parseFloat((datos.p1_peso / datos.p2_estatura ** 2).toFixed(2));

  // ── Bloque 1: Contraindicaciones absolutas ──────────────────────────────────
  // Cualquier "Sí" en P5, P6 o P7 es descalificante independientemente del IMC.
  const tieneContraindicacionCritica =
    datos.p5_contraindicacion_oncologica ||
    datos.p6_embarazo_lactancia ||
    datos.p7_tca_activo;

  if (tieneContraindicacionCritica) {
    return { semaforo: 'ROJA', imc };
  }

  // ── Bloque 2: IMC insuficiente ──────────────────────────────────────────────
  // IMC < 25 no alcanza umbral de sobrepeso; el paciente no es candidato.
  if (imc < 25) {
    return { semaforo: 'ROJA', imc };
  }

  // ── Bloque 3: Candidato óptimo ──────────────────────────────────────────────
  // IMC ≥ 30 (obesidad grado I+) → candidato directo sin condiciones adicionales.
  if (imc >= 30) {
    return { semaforo: 'VERDE', imc };
  }

  // ── Bloque 4: IMC 27–29.9 (sobrepeso con criterio clínico) ─────────────────
  if (imc >= 27) {
    // Con comorbilidades calificantes → candidato confirmado.
    if (datos.p3_comorbilidades) {
      return { semaforo: 'VERDE', imc };
    }

    // Sin comorbilidades pero con food noise alto o intentos previos fallidos
    // → candidato potencial que requiere evaluación adicional.
    if (datos.p8_food_noise >= FOOD_NOISE_ALTO || datos.p9_intentos_previos) {
      return { semaforo: 'AMARILLA', imc };
    }
  }

  // ── Bloque 5: IMC 25–26.9 sin condición calificante ────────────────────────
  // No alcanza criterios actuales de elegibilidad para tratamiento GLP-1.
  return { semaforo: 'ROJA', imc };
}
