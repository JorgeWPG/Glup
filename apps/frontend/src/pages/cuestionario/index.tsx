import { useState, useCallback } from 'react';
import './cuestionario.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type TiempoSobrepeso = 'menos_1_anio' | '1_a_3_anios' | 'mas_3_anios';
type Screen = 'quiz' | 'lead' | 'loading' | 'result';
type Semaforo = 'VERDE' | 'AMARILLA' | 'ROJA';
type BoolField =
  | 'p3_comorbilidades'
  | 'p5_contraindicacion_oncologica'
  | 'p6_embarazo_lactancia'
  | 'p7_tca_activo'
  | 'p9_intentos_previos'
  | 'p10_medicacion_actual';

interface QuizData {
  p1_peso:                        string;
  p2_estatura_cm:                 string;
  p3_comorbilidades:              boolean | null;
  p4_tiempoSobrepeso:             TiempoSobrepeso | null;
  p5_contraindicacion_oncologica: boolean | null;
  p6_embarazo_lactancia:          boolean | null;
  p7_tca_activo:                  boolean | null;
  p8_food_noise:                  number | null;
  p9_intentos_previos:            boolean | null;
  p10_medicacion_actual:          boolean | null;
}

interface LeadData {
  nombre:         string;
  whatsapp:       string;
  consentimiento: boolean;
}

interface ApiResponse {
  ok:        boolean;
  sessionId: string;
  semaforo:  Semaforo;
  imc:       number;
  timestamp: string;
}

type LeadErrors = Partial<Record<keyof LeadData, string>>;

// ─── Step Configuration ───────────────────────────────────────────────────────

type Step =
  | { type: 'fisica'; block: string; question: string; hint: string }
  | { type: 'yesno';  block: string; question: string; hint: string; field: BoolField }
  | { type: 'enum';   block: string; question: string; hint: string }
  | { type: 'scale';  block: string; question: string; hint: string };

const STEPS: Step[] = [
  {
    type: 'fisica',
    block: 'Bloque 1 de 4 — Datos físicos',
    question: '¿Cuánto pesas y cuánto mides?',
    hint: 'Calculamos tu Índice de Masa Corporal (IMC) para evaluar tu perfil metabólico.',
  },
  {
    type: 'yesno',
    block: 'Bloque 2 de 4 — Historial médico',
    question: '¿Tienes diagnóstico de diabetes tipo 2, hipertensión arterial o dislipidemia?',
    hint: 'Colesterol o triglicéridos altos también califican. Este dato puede cambiar tu elegibilidad.',
    field: 'p3_comorbilidades',
  },
  {
    type: 'enum',
    block: 'Bloque 2 de 4 — Historial médico',
    question: '¿Cuánto tiempo llevas con sobrepeso u obesidad?',
    hint: 'Una historia más larga indica una causa biológica más allá de los hábitos.',
  },
  {
    type: 'yesno',
    block: 'Bloque 3 de 4 — Contraindicaciones',
    question: '¿Tienes historial de pancreatitis crónica, cáncer tiroideo medular o síndrome MEN-2?',
    hint: 'Información confidencial que garantiza que el tratamiento sea seguro para ti.',
    field: 'p5_contraindicacion_oncologica',
  },
  {
    type: 'yesno',
    block: 'Bloque 3 de 4 — Contraindicaciones',
    question: '¿Estás actualmente embarazada o en período de lactancia?',
    hint: 'El tratamiento GLP-1 no está indicado durante el embarazo o la lactancia.',
    field: 'p6_embarazo_lactancia',
  },
  {
    type: 'yesno',
    block: 'Bloque 3 de 4 — Contraindicaciones',
    question: '¿Tienes diagnóstico activo de trastorno de conducta alimentaria (TCA)?',
    hint: 'Anorexia, bulimia o trastorno por atracón con criterios clínicos vigentes.',
    field: 'p7_tca_activo',
  },
  {
    type: 'scale',
    block: 'Bloque 4 de 4 — Hábitos',
    question: '¿Con qué frecuencia tienes pensamientos intrusivos sobre comida?',
    hint: 'El "food noise" es el síntoma que el tratamiento GLP-1 reduce desde el primer mes.',
  },
  {
    type: 'yesno',
    block: 'Bloque 4 de 4 — Hábitos',
    question: '¿Has intentado perder peso con dieta o ejercicio sin resultados sostenidos?',
    hint: 'Recuperar el peso perdido repetidamente es señal de un desequilibrio biológico.',
    field: 'p9_intentos_previos',
  },
  {
    type: 'yesno',
    block: 'Bloque 4 de 4 — Hábitos',
    question: '¿Tomas actualmente medicamentos para diabetes, pérdida de peso o insulina?',
    hint: 'Esta información permite al médico personalizar tu tratamiento y evitar interacciones.',
    field: 'p10_medicacion_actual',
  },
];

const TIEMPO_OPTIONS: { value: TiempoSobrepeso; label: string }[] = [
  { value: 'menos_1_anio', label: 'Menos de 1 año' },
  { value: '1_a_3_anios',  label: 'Entre 1 y 3 años' },
  { value: 'mas_3_anios',  label: 'Más de 3 años' },
];

const SCALE_LABELS = ['Raramente', 'A veces', 'Seguido', 'Mucho', 'Siempre'] as const;

const RESULT_CONFIG: Record<Semaforo, { title: string; message: string }> = {
  VERDE: {
    title: 'Eres candidato al tratamiento',
    message:
      'Tu perfil metabólico cumple los criterios de elegibilidad para el tratamiento GLP-1. Un endocrinólogo certificado CMP revisará tu caso y se contactará contigo en menos de 24 horas.',
  },
  AMARILLA: {
    title: 'Candidato potencial',
    message:
      'Tu perfil sugiere que podrías beneficiarte del tratamiento. Un médico especialista revisará tu caso en detalle para confirmar la indicación y diseñar tu plan personalizado.',
  },
  ROJA: {
    title: 'No eres candidato en este momento',
    message:
      'Basándonos en tu perfil actual, el tratamiento GLP-1 no está indicado para ti. Nuestro equipo médico puede orientarte sobre otras opciones disponibles para tu situación.',
  },
};

const TOTAL_STEPS = STEPS.length + 1; // +1 for lead capture screen

// ─── Validation ───────────────────────────────────────────────────────────────

const vPeso = (v: string): string | null => {
  const n = parseFloat(v);
  if (!v.trim() || isNaN(n)) return 'Ingresa tu peso en kg';
  if (n < 30)  return 'El peso mínimo es 30 kg';
  if (n > 250) return 'El peso máximo es 250 kg';
  return null;
};

const vEstatura = (v: string): string | null => {
  const n = parseFloat(v);
  if (!v.trim() || isNaN(n)) return 'Ingresa tu estatura en cm';
  if (n < 100) return 'La estatura mínima es 100 cm';
  if (n > 250) return 'La estatura máxima es 250 cm';
  return null;
};

const vNombre = (v: string): string | null => {
  if (!v.trim()) return 'Ingresa tu nombre';
  if (v.trim().length < 2) return 'Mínimo 2 caracteres';
  return null;
};

const vWhatsapp = (v: string): string | null => {
  if (!v) return 'Ingresa tu número de WhatsApp';
  if (!v.startsWith('9')) return 'Los números celulares peruanos empiezan con 9';
  if (v.length !== 9) return 'Debe tener exactamente 9 dígitos';
  return null;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconCheck = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconX = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CuestionarioPage() {
  const [screen, setScreen]           = useState<Screen>('quiz');
  const [stepIdx, setStepIdx]         = useState(0);
  const [quizData, setQuizData]       = useState<QuizData>({
    p1_peso: '', p2_estatura_cm: '',
    p3_comorbilidades: null, p4_tiempoSobrepeso: null,
    p5_contraindicacion_oncologica: null, p6_embarazo_lactancia: null,
    p7_tca_activo: null, p8_food_noise: null,
    p9_intentos_previos: null, p10_medicacion_actual: null,
  });
  const [lead, setLead]               = useState<LeadData>({ nombre: '', whatsapp: '', consentimiento: false });
  const [leadErrors, setLeadErrors]   = useState<LeadErrors>({});
  const [pesoErr, setPesoErr]         = useState<string | null>(null);
  const [estaturaErr, setEstaturaErr] = useState<string | null>(null);
  const [result, setResult]           = useState<ApiResponse | null>(null);
  const [apiError, setApiError]       = useState<string | null>(null);

  const progressPct = screen === 'quiz'
    ? Math.round(((stepIdx + 1) / TOTAL_STEPS) * 100)
    : 100;

  const step = STEPS[stepIdx];

  // ── Can proceed ─────────────────────────────────────────────────────────────

  const canProceed = (): boolean => {
    if (!step) return false;
    if (step.type === 'fisica') return !vPeso(quizData.p1_peso) && !vEstatura(quizData.p2_estatura_cm);
    if (step.type === 'yesno')  return quizData[step.field] !== null;
    if (step.type === 'enum')   return quizData.p4_tiempoSobrepeso !== null;
    if (step.type === 'scale')  return quizData.p8_food_noise !== null;
    return false;
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const advance = useCallback((nextIdx: number) => {
    if (nextIdx < STEPS.length) setStepIdx(nextIdx);
    else setScreen('lead');
  }, []);

  const goNext = () => {
    if (step?.type === 'fisica') {
      const pe = vPeso(quizData.p1_peso);
      const ee = vEstatura(quizData.p2_estatura_cm);
      setPesoErr(pe);
      setEstaturaErr(ee);
      if (pe || ee) return;
    }
    advance(stepIdx + 1);
  };

  const goBack = () => {
    if (screen === 'lead') { setScreen('quiz'); setStepIdx(STEPS.length - 1); return; }
    if (stepIdx > 0) setStepIdx(i => i - 1);
    else window.location.href = '/';
  };

  // Auto-advance after card selection with a brief visual delay
  const selectAndAdvance = (patch: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...patch }));
    setTimeout(() => advance(stepIdx + 1), 380);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const errors: LeadErrors = {};
    const ne = vNombre(lead.nombre);
    const we = vWhatsapp(lead.whatsapp);
    if (ne) errors.nombre = ne;
    if (we) errors.whatsapp = we;
    if (!lead.consentimiento) errors.consentimiento = 'Debes aceptar el consentimiento para continuar';
    setLeadErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setScreen('loading');
    setApiError(null);

    const payload = {
      // Datos de contacto — usados por el backend solo para la alerta n8n/WhatsApp
      nombre:   lead.nombre,
      whatsapp: lead.whatsapp,
      // Test metabólico
      p1_peso:                       parseFloat(quizData.p1_peso),
      p2_estatura:                   parseFloat(quizData.p2_estatura_cm) / 100,
      p3_comorbilidades:             quizData.p3_comorbilidades!,
      p4_tiempoSobrepeso:            quizData.p4_tiempoSobrepeso!,
      p5_contraindicacion_oncologica: quizData.p5_contraindicacion_oncologica!,
      p6_embarazo_lactancia:          quizData.p6_embarazo_lactancia!,
      p7_tca_activo:                  quizData.p7_tca_activo!,
      p8_food_noise:                  quizData.p8_food_noise!,
      p9_intentos_previos:            quizData.p9_intentos_previos!,
      p10_medicacion_actual:          quizData.p10_medicacion_actual!,
    };

    try {
      const res  = await fetch('/api/v1/triaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: ApiResponse = await res.json();
      setResult(data);
      setScreen('result');
    } catch {
      setApiError('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.');
      setScreen('lead');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="quiz" id="main-content">

      {/* ── Progress Bar ──────────────────────────────────────────────────────── */}
      {(screen === 'quiz' || screen === 'lead') && (
        <div
          className="quiz-progress"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso: ${progressPct}%`}
        >
          <div className="quiz-progress__header">
            <span className="quiz-progress__label">
              {screen === 'quiz' ? `Pregunta ${stepIdx + 1} de ${STEPS.length}` : 'Último paso'}
            </span>
            <span className="quiz-progress__pct">{progressPct}%</span>
          </div>
          <div className="quiz-progress__track">
            <div className="quiz-progress__fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {/* ── Quiz Step ─────────────────────────────────────────────────────────── */}
      {screen === 'quiz' && step && (
        <div key={stepIdx} className="quiz-step">

          <p className="quiz-block-label">{step.block}</p>
          <h1 className="quiz-question">{step.question}</h1>
          <p className="quiz-hint">{step.hint}</p>

          {/* Datos físicos ─────────────────────────────────────────────────── */}
          {step.type === 'fisica' && (
            <div className="input-group">

              <div className="input-field">
                <label className="input-label" htmlFor="inp-peso">
                  Peso <span>(kg)</span>
                </label>
                <div className={`input-wrapper${pesoErr ? ' input--error' : ''}`}>
                  <button
                    type="button" className="input-stepper"
                    aria-label="Disminuir peso"
                    onClick={() => {
                      const v = String(Math.max(30, (parseFloat(quizData.p1_peso) || 0) - 1));
                      setQuizData(d => ({ ...d, p1_peso: v }));
                      setPesoErr(vPeso(v));
                    }}
                  >−</button>
                  <input
                    id="inp-peso" className="input-native"
                    type="number" inputMode="decimal"
                    min={30} max={250} placeholder="75"
                    value={quizData.p1_peso}
                    onChange={e => {
                      setQuizData(d => ({ ...d, p1_peso: e.target.value }));
                      setPesoErr(vPeso(e.target.value));
                    }}
                    aria-describedby={pesoErr ? 'err-peso' : undefined}
                  />
                  <span className="input-unit">kg</span>
                  <button
                    type="button" className="input-stepper"
                    aria-label="Aumentar peso"
                    onClick={() => {
                      const v = String(Math.min(250, (parseFloat(quizData.p1_peso) || 0) + 1));
                      setQuizData(d => ({ ...d, p1_peso: v }));
                      setPesoErr(vPeso(v));
                    }}
                  >+</button>
                </div>
                {pesoErr && <p id="err-peso" className="input-error-msg" role="alert">{pesoErr}</p>}
              </div>

              <div className="input-field">
                <label className="input-label" htmlFor="inp-estatura">
                  Estatura <span>(cm · ej: 170)</span>
                </label>
                <div className={`input-wrapper${estaturaErr ? ' input--error' : ''}`}>
                  <button
                    type="button" className="input-stepper"
                    aria-label="Disminuir estatura"
                    onClick={() => {
                      const v = String(Math.max(100, (parseFloat(quizData.p2_estatura_cm) || 0) - 1));
                      setQuizData(d => ({ ...d, p2_estatura_cm: v }));
                      setEstaturaErr(vEstatura(v));
                    }}
                  >−</button>
                  <input
                    id="inp-estatura" className="input-native"
                    type="number" inputMode="decimal"
                    min={100} max={250} placeholder="170"
                    value={quizData.p2_estatura_cm}
                    onChange={e => {
                      setQuizData(d => ({ ...d, p2_estatura_cm: e.target.value }));
                      setEstaturaErr(vEstatura(e.target.value));
                    }}
                    aria-describedby={estaturaErr ? 'err-estatura' : undefined}
                  />
                  <span className="input-unit">cm</span>
                  <button
                    type="button" className="input-stepper"
                    aria-label="Aumentar estatura"
                    onClick={() => {
                      const v = String(Math.min(250, (parseFloat(quizData.p2_estatura_cm) || 0) + 1));
                      setQuizData(d => ({ ...d, p2_estatura_cm: v }));
                      setEstaturaErr(vEstatura(v));
                    }}
                  >+</button>
                </div>
                {estaturaErr && <p id="err-estatura" className="input-error-msg" role="alert">{estaturaErr}</p>}
              </div>

            </div>
          )}

          {/* Yes / No ─────────────────────────────────────────────────────── */}
          {step.type === 'yesno' && (
            <div className="choice-grid" role="group" aria-label="Selecciona Sí o No">
              <button
                type="button"
                className={`choice-btn${quizData[step.field] === true ? ' choice-btn--selected' : ''}`}
                onClick={() => selectAndAdvance({ [step.field]: true } as Partial<QuizData>)}
                aria-pressed={quizData[step.field] === true}
              >
                <span className="choice-btn__icon"><IconCheck size={30} /></span>
                Sí
              </button>
              <button
                type="button"
                className={`choice-btn choice-btn--no${quizData[step.field] === false ? ' choice-btn--selected' : ''}`}
                onClick={() => selectAndAdvance({ [step.field]: false } as Partial<QuizData>)}
                aria-pressed={quizData[step.field] === false}
              >
                <span className="choice-btn__icon"><IconX size={26} /></span>
                No
              </button>
            </div>
          )}

          {/* Enum ─────────────────────────────────────────────────────────── */}
          {step.type === 'enum' && (
            <ul className="option-list" role="group" aria-label="Selecciona una opción">
              {TIEMPO_OPTIONS.map(opt => (
                <li key={opt.value}>
                  <button
                    type="button"
                    className={`option-btn${quizData.p4_tiempoSobrepeso === opt.value ? ' option-btn--selected' : ''}`}
                    onClick={() => selectAndAdvance({ p4_tiempoSobrepeso: opt.value })}
                    aria-pressed={quizData.p4_tiempoSobrepeso === opt.value}
                  >
                    {opt.label}
                    <span className="option-check" aria-hidden="true">
                      {quizData.p4_tiempoSobrepeso === opt.value && <IconCheck size={12} />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Scale (Food Noise) ────────────────────────────────────────────── */}
          {step.type === 'scale' && (
            <>
              <div className="scale-grid" role="group" aria-label="Escala de 1 a 5">
                {([1, 2, 3, 4, 5] as const).map((n, i) => (
                  <button
                    key={n}
                    type="button"
                    className={`scale-btn${quizData.p8_food_noise === n ? ' scale-btn--selected' : ''}`}
                    onClick={() => selectAndAdvance({ p8_food_noise: n })}
                    aria-pressed={quizData.p8_food_noise === n}
                    aria-label={`${n} — ${SCALE_LABELS[i]}`}
                  >
                    <span className="scale-btn__number">{n}</span>
                    <span className="scale-btn__label">{SCALE_LABELS[i]}</span>
                  </button>
                ))}
              </div>
              <div className="scale-ends" aria-hidden="true">
                <span>Casi nunca</span>
                <span>Todo el tiempo</span>
              </div>
            </>
          )}

          {/* Navigation ───────────────────────────────────────────────────── */}
          <div className="quiz-nav">
            {step.type === 'fisica' && (
              <button
                type="button"
                className="btn btn--primary btn--lg quiz-btn-continue"
                onClick={goNext}
                disabled={!canProceed()}
              >
                Continuar <IconArrow />
              </button>
            )}
            <button type="button" className="btn-back" onClick={goBack}>
              <IconBack />
              {stepIdx === 0 ? 'Volver al inicio' : 'Pregunta anterior'}
            </button>
          </div>

        </div>
      )}

      {/* ── Lead Capture ──────────────────────────────────────────────────────── */}
      {screen === 'lead' && (
        <div className="quiz-step">
          <p className="quiz-block-label">Casi listo</p>
          <h1 className="quiz-question">¿A dónde enviamos tu resultado?</h1>
          <p className="quiz-hint">
            Tu información está protegida bajo la Ley N° 29733. Solo la usamos para enviarte tu
            resultado y que un endocrinólogo certificado CMP pueda contactarte.
          </p>

          <form
            className="lead-form"
            onSubmit={e => { e.preventDefault(); handleSubmit(); }}
            noValidate
          >
            {/* Nombre */}
            <div className="lead-field">
              <label className="lead-label" htmlFor="lead-nombre">Nombre completo</label>
              <input
                id="lead-nombre"
                className={`lead-input${leadErrors.nombre ? ' input--error' : ''}`}
                type="text"
                placeholder="Ej: María García"
                autoComplete="name"
                value={lead.nombre}
                onChange={e => {
                  setLead(d => ({ ...d, nombre: e.target.value }));
                  if (leadErrors.nombre) setLeadErrors(p => ({ ...p, nombre: undefined }));
                }}
                aria-describedby={leadErrors.nombre ? 'err-nombre' : undefined}
              />
              {leadErrors.nombre && (
                <p id="err-nombre" className="input-error-msg" role="alert">{leadErrors.nombre}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="lead-field">
              <label className="lead-label" htmlFor="lead-wa">WhatsApp</label>
              <div className={`phone-row${leadErrors.whatsapp ? ' input--error' : ''}`}>
                <span className="phone-prefix">+51</span>
                <input
                  id="lead-wa"
                  className="phone-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="999 999 999"
                  maxLength={9}
                  autoComplete="tel-national"
                  value={lead.whatsapp}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setLead(d => ({ ...d, whatsapp: digits }));
                    if (leadErrors.whatsapp) setLeadErrors(p => ({ ...p, whatsapp: undefined }));
                  }}
                  aria-describedby={leadErrors.whatsapp ? 'err-wa' : undefined}
                />
              </div>
              {leadErrors.whatsapp && (
                <p id="err-wa" className="input-error-msg" role="alert">{leadErrors.whatsapp}</p>
              )}
            </div>

            {/* Consentimiento */}
            <div className="lead-field">
              <button
                type="button"
                role="checkbox"
                aria-checked={lead.consentimiento}
                className={`consent-btn${lead.consentimiento ? ' consent--checked' : ''}${leadErrors.consentimiento ? ' consent--error' : ''}`}
                onClick={() => {
                  setLead(d => ({ ...d, consentimiento: !d.consentimiento }));
                  if (leadErrors.consentimiento) setLeadErrors(p => ({ ...p, consentimiento: undefined }));
                }}
              >
                <span className="consent-box" aria-hidden="true">
                  {lead.consentimiento && <IconCheck size={12} />}
                </span>
                <span className="consent-text">
                  <strong>Autorizo el tratamiento de mis datos de salud</strong> para recibir mi
                  resultado metabólico y ser contactado por un médico de GLUP, conforme a la{' '}
                  <a href="/privacidad" target="_blank" rel="noopener noreferrer">
                    Política de Privacidad
                  </a>{' '}
                  y la Ley N° 29733.
                </span>
              </button>
              {leadErrors.consentimiento && (
                <p className="input-error-msg" role="alert">{leadErrors.consentimiento}</p>
              )}
            </div>

            {apiError && <p className="api-error" role="alert">{apiError}</p>}

            <div className="quiz-nav">
              <button type="submit" className="btn btn--primary btn--lg quiz-btn-continue">
                Ver mi resultado <IconArrow />
              </button>
              <button type="button" className="btn-back" onClick={goBack}>
                <IconBack /> Pregunta anterior
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────────────── */}
      {screen === 'loading' && (
        <div className="quiz-loading" role="status" aria-live="assertive" aria-busy="true">
          <div className="spinner" aria-hidden="true" />
          <p className="loading-title">Analizando tu perfil metabólico...</p>
          <p className="loading-sub">Esto toma solo unos segundos</p>
        </div>
      )}

      {/* ── Result ────────────────────────────────────────────────────────────── */}
      {screen === 'result' && result && (() => {
        const cfg = RESULT_CONFIG[result.semaforo];
        const s   = result.semaforo;
        return (
          <div className="quiz-result" aria-live="polite">

            <div className={`result-card result-card--${s}`}>
              <div className={`result-dot result-dot--${s}`} aria-hidden="true" />
              <p className="result-eyebrow">Resultado de tu triaje metabólico</p>
              <h1 className="result-title">{cfg.title}</h1>
              <p className={`result-imc result-imc--${s}`} aria-label={`Tu IMC es ${result.imc}`}>
                {result.imc}
              </p>
              <p className="result-imc-label">Índice de Masa Corporal (IMC)</p>
              <p className="result-message">{cfg.message}</p>
            </div>

            <details className="result-debug">
              <summary>Respuesta del servidor (verificación de conexión)</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>

            <a
              href="/"
              className="btn btn--outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Volver al inicio
            </a>

          </div>
        );
      })()}

    </div>
  );
}
