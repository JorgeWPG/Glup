import { useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  tag: string;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Test Metabólico Gratuito',
    description:
      'Responde 10 preguntas sobre tu salud en menos de 3 minutos. Recibes tu perfil metabólico al instante, sin registro previo.',
    tag: '3 minutos · Sin registro',
  },
  {
    number: '02',
    title: 'Teleconsulta con Endocrinólogo',
    description:
      'Un médico especialista certificado por el CMP revisa tu caso, resuelve tus dudas y diseña tu plan de tratamiento personalizado.',
    tag: 'Videollamada · Receta digital incluida',
  },
  {
    number: '03',
    title: 'Medicamento a tu Puerta',
    description:
      'Recibe tu tratamiento con cadena de frío certificada, directamente en tu domicilio en Lima Metropolitana. Con termómetro indicador incluido.',
    tag: '24–48h · Lima Metropolitana',
  },
];

const FAQS: FaqItem[] = [
  {
    id: 1,
    question: '¿Es seguro el tratamiento metabólico con GLP-1?',
    answer:
      'Sí. Los medicamentos GLP-1 son los tratamientos para obesidad más estudiados del mundo, con aprobación de la FDA (EE.UU.) y registro sanitario vigente ante DIGEMID (Perú). En GLUP, solo trabajan endocrinólogos registrados en el Colegio Médico del Perú (CMP) que evalúan tu caso individualmente antes de cualquier prescripción.',
  },
  {
    id: 2,
    question: '¿Hacen delivery a mi distrito en Lima Metropolitana?',
    answer:
      'Sí, cubrimos toda Lima Metropolitana: Miraflores, San Isidro, Surco, La Molina, Barranco, San Borja, Jesús María, Lince, Magdalena del Mar, Pueblo Libre, San Miguel, Callao, Los Olivos, Independencia, San Juan de Lurigancho, entre otros. El despacho incluye cadena de frío certificada para garantizar la efectividad del medicamento.',
  },
  {
    id: 3,
    question: '¿Puedo pagar con Yape, Plin o tarjeta de crédito?',
    answer:
      'Aceptamos todos los métodos de pago disponibles en Perú: Visa, Mastercard y American Express (hasta 12 cuotas sin intereses con bancos seleccionados), Yape, Plin y pagos directos vía Niubiz. También contamos con opciones de financiamiento con BBVA, BCP e Interbank.',
  },
  {
    id: 4,
    question: '¿Necesito receta médica para iniciar el tratamiento?',
    answer:
      'La receta es obligatoria por ley peruana. Por eso el proceso GLUP incluye una teleconsulta con un endocrinólogo certificado CMP que, después de evaluar tu perfil metabólico, emite la receta médica digital en el formato vigente exigido por DIGEMID. Tú no necesitas conseguir la receta por tu cuenta.',
  },
  {
    id: 5,
    question: '¿Cuánto tiempo tarda en llegar mi medicamento?',
    answer:
      'Una vez que el médico emite la receta y la farmacia la valida, el despacho se realiza entre 24 y 48 horas hábiles en Lima Metropolitana. El medicamento llega en empaque de cadena de frío con termómetro indicador incluido para que puedas verificar que llegó en condiciones óptimas.',
  },
];

// ── SVG Icons (inline, aria-hidden) ──────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="navbar" role="banner">
      <nav className="container navbar__inner" aria-label="Navegación principal">
        <a href="/" className="navbar__logo" aria-label="GLUP — Ir al inicio">
          GLUP<span>.</span>
        </a>
        <a href="#como-funciona" className="btn btn--outline navbar__cta">
          ¿Cómo funciona?
        </a>
      </nav>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="hero-phone" aria-hidden="true">
        <div className="phone-topbar">
          <span className="phone-topbar__brand">GLUP<span>.</span></span>
          <div className="phone-topbar__dots"><span /><span /><span /></div>
        </div>
        <div className="phone-body">
          <div>
            <p className="phone-eyebrow">Resultado de tu test</p>
            <p className="phone-title">Tu Semáforo<br />Metabólico</p>
          </div>
          <div className="semaforo">
            <div className="semaforo__item">
              <div className="semaforo__light semaforo__light--rojo" />
              <span className="semaforo__label">Riesgo<br />Alto</span>
            </div>
            <div className="semaforo__item">
              <div className="semaforo__light semaforo__light--amarillo" />
              <span className="semaforo__label">Perfil<br />Moderado</span>
            </div>
            <div className="semaforo__item">
              <div className="semaforo__light semaforo__light--verde" />
              <span className="semaforo__label semaforo__label--active">Candidato<br />Ideal</span>
            </div>
          </div>
          <div className="phone-result">
            <div className="phone-result__left">
              <div className="phone-result__imc">24.8</div>
              <div className="phone-result__imc-label">IMC</div>
            </div>
            <div className="phone-result__text">
              <div className="phone-result__label">Candidato ideal para tratamiento GLP-1</div>
              <div className="phone-result__sub">Un médico CMP te contacta hoy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero__grid">

        {/* ── Columna izquierda ── */}
        <div className="hero__left">
          <div>
            <span className="badge badge--verde">Nuevo en Lima — Tratamiento GLP-1</span>
          </div>
          <h1 id="hero-heading" className="hero__title">
            El ruido mental de la comida<br />
            <span className="accent-gradient">tiene solución médica.</span>
          </h1>
          <p className="hero__subtitle">
            Conectamos pacientes en Lima con endocrinólogos certificados CMP para
            tratamientos metabólicos GLP-1 personalizados. Test gratuito, teleconsulta
            y despacho con cadena de frío a domicilio.
          </p>
          <ul className="hero__seals" aria-label="Certificaciones y avales">
            <li className="seal">
              <span className="seal__icon"><IconCheck /></span>
              <span>Médicos registrados <strong>CMP</strong></span>
            </li>
            <li className="seal">
              <span className="seal__icon"><IconCheck /></span>
              <span>Productos autorizados <strong>DIGEMID</strong></span>
            </li>
            <li className="seal">
              <span className="seal__icon"><IconLock /></span>
              <span>Datos protegidos <strong>Ley 29733</strong></span>
            </li>
          </ul>
          <div className="hero__cta">
            <a href="/cuestionario" className="btn btn--primary btn--lg">
              Hacer mi test gratuito
              <span className="btn__arrow"><IconArrow /></span>
            </a>
            <p className="hero__note">
              <strong>Sin registro</strong> · Solo 3 minutos · Resultado inmediato
            </p>
          </div>
        </div>

        {/* ── Columna derecha — solo desktop ── */}
        <div className="hero__right">
          <HeroVisual />
        </div>

      </div>
    </section>
  );
}

function DolorSection() {
  return (
    <section id="dolor" className="dolor" aria-labelledby="dolor-heading">
      <div className="container">

        <header className="dolor__header">
          <p className="section-label">El problema real</p>
          <h2 id="dolor-heading" className="section-title">
            No es falta de voluntad.<br />Es biología.
          </h2>
        </header>

        <div className="dolor__content">
          <p className="dolor__text">
            Si piensas en comida constantemente —incluso cuando no tienes hambre—
            tu cerebro está procesando señales hormonales fuera de control. Esto se llama{' '}
            <strong>"food noise"</strong> y es causado por desequilibrios en la grelina,
            la resistencia a la leptina y la disfunción en la señalización de la insulina.
            No es un problema de carácter.
          </p>

          <blockquote className="dolor__blockquote">
            "No fallaste en la dieta. La dieta falló en reconocer tu biología."
          </blockquote>

          <p className="dolor__text">
            Los tratamientos modernos basados en GLP-1 actúan directamente sobre estos
            mecanismos cerebrales, reduciendo el ruido mental desde el primer mes. No son
            atajos: son la medicina que tu biología necesitaba, y hoy está disponible en Lima.
          </p>

          <ul className="dolor__stats" aria-label="Estadísticas de sobrepeso en Lima, Perú">
            <li className="stat">
              <div className="stat__number" aria-label="62 por ciento">62%</div>
              <p className="stat__label">de adultos en Lima tiene sobrepeso u obesidad (MINSA, 2023)</p>
            </li>
            <li className="stat">
              <div className="stat__number" aria-label="87 por ciento">87%</div>
              <p className="stat__label">recupera el peso perdido en 5 años solo con dieta y ejercicio</p>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}

function ComoFuncionaSection() {
  return (
    <section id="como-funciona" className="como-funciona" aria-labelledby="como-heading">
      <div className="container">

        <header className="como-funciona__header">
          <p className="section-label">El proceso</p>
          <h2 id="como-heading" className="section-title">
            3 pasos. Sin complicaciones.
          </h2>
        </header>

        <ol className="steps" aria-label="Pasos del proceso GLUP">
          {STEPS.map((step) => (
            <li key={step.number} className="step">
              <div className="step__number" aria-hidden="true">{step.number}</div>
              <div className="step__content">
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.description}</p>
                <span className="step__tag">{step.tag}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="steps__cta">
          <a href="/cuestionario" className="btn btn--primary btn--lg">
            Comenzar ahora — es gratis
            <span className="btn__arrow"><IconArrow /></span>
          </a>
        </div>

      </div>
    </section>
  );
}

function FaqsSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="preguntas" className="faqs" aria-labelledby="faqs-heading">
      <div className="container">

        <header className="faqs__header">
          <p className="section-label">Resolvemos tus dudas</p>
          <h2 id="faqs-heading" className="section-title">
            Preguntas frecuentes
          </h2>
        </header>

        <dl className="faq-list">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`faq-item${isOpen ? ' faq-item--open' : ''}`}
              >
                <dt>
                  <button
                    className="faq-item__btn"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-body-${faq.id}`}
                    id={`faq-btn-${faq.id}`}
                  >
                    <h3 className="faq-item__question">{faq.question}</h3>
                    <span className="faq-item__icon" aria-hidden="true">+</span>
                  </button>
                </dt>
                <dd
                  id={`faq-body-${faq.id}`}
                  className={`faq-item__body${isOpen ? ' faq-item__body--open' : ''}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                >
                  <p className="faq-item__answer">{faq.answer}</p>
                </dd>
              </div>
            );
          })}
        </dl>

      </div>
    </section>
  );
}

function FooterSection() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">

        <div className="footer__top">
          <div>
            <div className="footer__logo">GLUP<span>.</span></div>
            <p className="footer__tagline">
              Salud metabólica accesible<br />para Lima y Perú.
            </p>
          </div>
          <nav aria-label="Links de pie de página">
            <ul className="footer__links">
              <li><a href="/privacidad">Aviso de Privacidad</a></li>
              <li><a href="/terminos">Términos y Condiciones</a></li>
              <li><a href="/cookies">Política de Cookies</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </nav>
        </div>

        <div className="footer__divider" role="separator" />

        <p className="footer__disclaimer">
          <strong>Aviso Legal:</strong> GLUP es un marketplace tecnológico que conecta
          pacientes con profesionales de salud independientes y farmacias autorizadas
          por DIGEMID. No brindamos diagnósticos médicos directos ni somos una entidad
          prestadora de salud (EPS). Los médicos de nuestra red son profesionales
          independientes registrados en el Colegio Médico del Perú (CMP). Los
          tratamientos son prescritos exclusivamente por médicos habilitados y los
          productos farmacéuticos cuentan con registro sanitario vigente ante DIGEMID.
        </p>

        <div className="footer__bottom">
          <span>© {year} GLUP SAC — Lima, Perú</span>
          <span>Todos los derechos reservados</span>
        </div>

      </div>
    </footer>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <DolorSection />
        <ComoFuncionaSection />
        <FaqsSection />
      </main>
      <FooterSection />
    </>
  );
}
