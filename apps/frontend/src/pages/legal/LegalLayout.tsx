import './legal.css';

interface Props {
  tag: string;
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}

export default function LegalLayout({
  tag,
  title,
  updatedAt = '16 de junio de 2026',
  children,
}: Props) {
  return (
    <div className="legal-page">
      <nav className="navbar" aria-label="Navegación">
        <div className="container navbar__inner">
          <a href="/" className="navbar__logo">
            GLUP<span>.</span>
          </a>
          <a href="/" className="btn btn--outline navbar__cta">
            ← Regresar al inicio
          </a>
        </div>
      </nav>

      <main className="legal-main" id="main-content">
        <div className="container">
          <div className="legal-prose">
            <header className="legal-header">
              <span className="legal-tag">{tag}</span>
              <h1 className="legal-title">{title}</h1>
              <p className="legal-meta">Última actualización: {updatedAt}</p>
            </header>
            {children}
          </div>
        </div>
      </main>

      <footer className="legal-page-footer" aria-label="Pie de página legal">
        <div className="container">
          <div className="legal-footer-content">
            <div className="legal-footer-brand">
              GLUP<span>.</span>
            </div>
            <p className="legal-footer-info">
              JAPG S.A.C. — RUC 20606022108<br />
              Av. Javier Prado Este Nro. 7255 Dpto. 201, Urb. Mayorazgo, Ate, Lima<br />
              <a href="mailto:hola@glup.health" style={{ color: 'inherit' }}>hola@glup.health</a>
              {' '}·{' '}
              <a href="tel:+51916583423" style={{ color: 'inherit' }}>+51 916 583 423</a>
            </p>
            <nav className="legal-footer-links" aria-label="Documentos legales">
              <a href="/privacidad">Aviso de Privacidad</a>
              <a href="/terminos">Términos y Condiciones</a>
              <a href="/cookies">Política de Cookies</a>
              <a href="/">Inicio</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
