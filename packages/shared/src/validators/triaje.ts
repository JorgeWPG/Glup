import { z } from 'zod';

/**
 * Esquema de validación para las 10 preguntas del triaje metabólico GLUP.
 *
 * Preguntas 5, 6 y 7 son contraindicaciones críticas que bloquean el acceso
 * al tratamiento con GLP-1 independientemente del IMC.
 */
export const TriajeSchema = z.object({
  /** P1 — Peso corporal en kilogramos */
  p1_peso: z
    .number({ required_error: 'El peso es obligatorio', invalid_type_error: 'El peso debe ser un número' })
    .min(30, 'El peso mínimo aceptado es 30 kg')
    .max(250, 'El peso máximo aceptado es 250 kg'),

  /** P2 — Estatura en metros (ej. 1.70) */
  p2_estatura: z
    .number({ required_error: 'La estatura es obligatoria', invalid_type_error: 'La estatura debe ser un número' })
    .min(1.0, 'La estatura mínima aceptada es 1.00 m')
    .max(2.5, 'La estatura máxima aceptada es 2.50 m'),

  /** P3 — ¿Tiene diagnóstico médico de diabetes tipo 2, hipertensión o dislipidemia? */
  p3_comorbilidades: z.boolean({
    required_error: 'Debe indicar si tiene comorbilidades',
    invalid_type_error: 'El campo comorbilidades debe ser verdadero o falso',
  }),

  /** P4 — ¿Cuánto tiempo lleva con sobrepeso u obesidad? */
  p4_tiempoSobrepeso: z.enum(['menos_1_anio', '1_a_3_anios', 'mas_3_anios'], {
    required_error: 'Debe indicar el tiempo con sobrepeso',
    invalid_type_error: 'Valor inválido para tiempo con sobrepeso',
  }),

  /**
   * P5 — CONTRAINDICACIÓN CRÍTICA
   * ¿Tiene diagnóstico de pancreatitis crónica, cáncer tiroideo medular
   * o síndrome MEN-2 (neoplasia endocrina múltiple tipo 2)?
   */
  p5_contraindicacion_oncologica: z.boolean({
    required_error: 'Debe responder la pregunta 5',
    invalid_type_error: 'El campo debe ser verdadero o falso',
  }),

  /**
   * P6 — CONTRAINDICACIÓN CRÍTICA
   * ¿Está actualmente embarazada o en período de lactancia?
   */
  p6_embarazo_lactancia: z.boolean({
    required_error: 'Debe responder la pregunta 6',
    invalid_type_error: 'El campo debe ser verdadero o falso',
  }),

  /**
   * P7 — CONTRAINDICACIÓN CRÍTICA
   * ¿Tiene diagnóstico activo de trastorno de conducta alimentaria (TCA)?
   * (Anorexia, bulimia, trastorno por atracón con criterios clínicos)
   */
  p7_tca_activo: z.boolean({
    required_error: 'Debe responder la pregunta 7',
    invalid_type_error: 'El campo debe ser verdadero o falso',
  }),

  /**
   * P8 — "Food noise": nivel de intrusividad de pensamientos sobre comida.
   * Escala 1 (nunca) → 5 (pensamientos constantes que interfieren con el día).
   */
  p8_food_noise: z
    .number({ required_error: 'Debe indicar el nivel de food noise', invalid_type_error: 'Debe ser un número del 1 al 5' })
    .int('El valor debe ser un número entero')
    .min(1, 'El valor mínimo es 1')
    .max(5, 'El valor máximo es 5'),

  /** P9 — ¿Ha intentado bajar de peso anteriormente con dieta y/o ejercicio sin éxito sostenido? */
  p9_intentos_previos: z.boolean({
    required_error: 'Debe responder la pregunta 9',
    invalid_type_error: 'El campo debe ser verdadero o falso',
  }),

  /** P10 — ¿Toma actualmente algún medicamento para diabetes, pérdida de peso o insulina? */
  p10_medicacion_actual: z.boolean({
    required_error: 'Debe responder la pregunta 10',
    invalid_type_error: 'El campo debe ser verdadero o falso',
  }),
});

export type TriajeInput = z.infer<typeof TriajeSchema>;
