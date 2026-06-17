import LegalLayout from './LegalLayout';

function Num({ n }: { n: number }) {
  return <span className="legal-num">{n}</span>;
}

export default function CookiesPage() {
  return (
    <LegalLayout tag="Legal · Cookies" title="Política de Cookies">

      {/* 1 */}
      <section className="legal-section">
        <h2><Num n={1} />¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que un sitio web almacena en su dispositivo
          (computadora, teléfono o tablet) cuando usted lo visita. Permiten que el sitio recuerde
          sus preferencias, mantenga su sesión activa y recopile información sobre cómo utiliza
          la plataforma.
        </p>
        <p>
          Además de cookies, GLUP puede usar tecnologías similares como{' '}
          <strong>web beacons</strong>, <strong>pixels</strong>, <strong>local storage</strong> y{' '}
          <strong>session storage</strong>, que en este documento se mencionan colectivamente como
          "cookies".
        </p>
      </section>

      {/* 2 */}
      <section className="legal-section">
        <h2><Num n={2} />Cookies que Utilizamos</h2>

        <h3>2.1 Cookies estrictamente necesarias</h3>
        <p>
          <strong>No requieren su consentimiento.</strong> Son indispensables para el
          funcionamiento de la Plataforma y no pueden desactivarse sin afectar su experiencia.
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th style={{ width: 100 }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>glup_session</code></td>
                <td>GLUP (glup.health)</td>
                <td>Mantiene su sesión autenticada activa</td>
                <td>Sesión</td>
              </tr>
              <tr>
                <td><code>glup_csrf</code></td>
                <td>GLUP (glup.health)</td>
                <td>Protección contra ataques CSRF</td>
                <td>Sesión</td>
              </tr>
              <tr>
                <td><code>glup_consent</code></td>
                <td>GLUP (glup.health)</td>
                <td>Registra sus preferencias de cookies</td>
                <td>12 meses</td>
              </tr>
              <tr>
                <td><code>glup_locale</code></td>
                <td>GLUP (glup.health)</td>
                <td>Recuerda su idioma y región seleccionados</td>
                <td>12 meses</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>2.2 Cookies de rendimiento y analítica</h3>
        <p>
          <strong>Requieren su consentimiento.</strong> Nos ayudan a entender cómo los usuarios
          interactúan con la Plataforma para mejorar su funcionamiento. Los datos son agregados
          y anónimos.
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th style={{ width: 100 }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>_ga</code></td>
                <td>Google Analytics</td>
                <td>Distingue usuarios únicos</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td><code>_ga_*</code></td>
                <td>Google Analytics</td>
                <td>Mantiene el estado de la sesión de Analytics</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td><code>_gid</code></td>
                <td>Google Analytics</td>
                <td>Distingue usuarios (diario)</td>
                <td>24 horas</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Los datos de Google Analytics se procesan con IP anonimizada y sin compartir
          información de identificación personal con Google para fines publicitarios.
        </p>

        <h3>2.3 Cookies funcionales</h3>
        <p>
          <strong>Requieren su consentimiento.</strong> Permiten funcionalidades mejoradas y
          personalización de la experiencia.
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th style={{ width: 100 }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>glup_ui_prefs</code></td>
                <td>GLUP (glup.health)</td>
                <td>Guarda preferencias de interfaz del usuario</td>
                <td>6 meses</td>
              </tr>
              <tr>
                <td><code>glup_triaje_draft</code></td>
                <td>GLUP (glup.health)</td>
                <td>Guarda el progreso parcial del triaje</td>
                <td>7 días</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>2.4 Cookies de marketing y terceros</h3>
        <p>
          <strong>Requieren su consentimiento.</strong> En caso de que GLUP active campañas
          publicitarias, podrían instalarse cookies de plataformas como Meta (Facebook/Instagram)
          o Google Ads para medir la eficacia de anuncios.
        </p>
        <div className="legal-callout legal-callout--success">
          <span className="legal-callout__icon">✓</span>
          <span>
            Actualmente, <strong>GLUP no tiene activas cookies de marketing de terceros</strong>.
            Esta sección se actualizará si esto cambia, con notificación previa en la plataforma.
          </span>
        </div>
      </section>

      {/* 3 */}
      <section className="legal-section">
        <h2><Num n={3} />Base Legal del Uso de Cookies</h2>
        <p>El uso de cookies en Perú se rige por:</p>
        <ul>
          <li>
            <strong>Ley N° 29733</strong> — Protección de Datos Personales (en cuanto las cookies
            recopilan datos personales)
          </li>
          <li>
            <strong>D.S. N° 003-2013-JUS</strong> — Reglamento de la Ley de Protección de Datos
            Personales
          </li>
          <li>
            Principios de transparencia e información previa al titular del dato
          </li>
        </ul>
        <p>
          Las cookies <strong>estrictamente necesarias</strong> tienen base legal en el{' '}
          <strong>interés legítimo</strong> de garantizar la seguridad y operatividad del
          servicio. Las demás categorías tienen como base legal el{' '}
          <strong>consentimiento expreso</strong> del usuario, otorgado a través de nuestro panel
          de preferencias de cookies.
        </p>
      </section>

      {/* 4 */}
      <section className="legal-section">
        <h2><Num n={4} />Gestión y Control de sus Preferencias</h2>

        <h3>4.1 Panel de preferencias de GLUP</h3>
        <p>
          Al ingresar por primera vez a glup.health, se le mostrará un banner de consentimiento
          de cookies. Puede aceptar todas, rechazar las opcionales o personalizar su elección
          categoría por categoría.
        </p>
        <p>
          Puede cambiar sus preferencias en cualquier momento desde el enlace{' '}
          <strong>"Configuración de cookies"</strong> ubicado en el pie de página del sitio.
        </p>

        <h3>4.2 Configuración del navegador</h3>
        <p>
          También puede gestionar o eliminar cookies directamente desde la configuración de su
          navegador:
        </p>
        <ul>
          <li>
            <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y
            otros datos de sitios
          </li>
          <li>
            <strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos
            del sitio
          </li>
          <li>
            <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web
          </li>
          <li>
            <strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios →
            Cookies
          </li>
        </ul>
        <div className="legal-callout legal-callout--warning">
          <span className="legal-callout__icon">⚠️</span>
          <span>
            Bloquear todas las cookies puede afectar el correcto funcionamiento de la Plataforma,
            incluyendo la imposibilidad de mantener su sesión iniciada.
          </span>
        </div>

        <h3>4.3 Opt-out de Google Analytics</h3>
        <p>
          Puede instalar el{' '}
          <strong>complemento de inhabilitación para navegadores de Google Analytics</strong>{' '}
          disponible en:{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--electrico)' }}
          >
            tools.google.com/dlpage/gaoptout
          </a>
        </p>
      </section>

      {/* 5 */}
      <section className="legal-section">
        <h2><Num n={5} />Transferencia Internacional de Datos mediante Cookies</h2>
        <p>
          Algunas de las cookies de terceros listadas en este documento (como Google Analytics)
          pueden implicar la transferencia de datos a servidores ubicados fuera del Perú,
          incluyendo los Estados Unidos. Dichas transferencias se realizan conforme a las
          garantías establecidas por los respectivos proveedores (ej.: Cláusulas Contractuales
          Tipo, certificaciones de privacidad) y con su consentimiento previo cuando aplica.
        </p>
      </section>

      {/* 6 */}
      <section className="legal-section">
        <h2><Num n={6} />Cookies y Datos de Salud</h2>
        <div className="legal-callout legal-callout--success">
          <span className="legal-callout__icon">🔒</span>
          <span>
            GLUP <strong>no utiliza cookies</strong> para almacenar, transmitir ni procesar datos
            sensibles de salud. Toda la información clínica ingresada durante el triaje se gestiona
            exclusivamente a través de conexiones seguras cifradas (HTTPS/TLS) y se almacena en
            servidores protegidos, conforme a nuestro{' '}
            <a href="/privacidad" style={{ color: '#005228' }}>Aviso de Privacidad</a>.
          </span>
        </div>
      </section>

      {/* 7 */}
      <section className="legal-section">
        <h2><Num n={7} />Actualizaciones a esta Política</h2>
        <p>
          Podemos actualizar esta Política de Cookies para reflejar cambios en las tecnologías
          que utilizamos o en el marco regulatorio aplicable. La fecha de última actualización al
          inicio de este documento indica cuándo se realizó la última revisión.
        </p>
        <p>
          Si los cambios son sustanciales, le notificaremos mediante un aviso en la Plataforma
          o por correo electrónico.
        </p>
      </section>

      {/* 8 */}
      <section className="legal-section">
        <h2><Num n={8} />Contacto</h2>
        <p>Para consultas relacionadas con el uso de cookies en GLUP:</p>
        <ul>
          <li>
            <strong>Correo electrónico:</strong>{' '}
            <a href="mailto:hola@glup.health" style={{ color: 'var(--electrico)' }}>
              hola@glup.health
            </a>
          </li>
          <li>
            <strong>Teléfono:</strong>{' '}
            <a href="tel:+51923544630" style={{ color: 'var(--electrico)' }}>
              +51 923 544 630
            </a>
          </li>
          <li>
            <strong>Dirección:</strong> Av. Javier Prado Este Nro. 7255 Dpto. 201, Urb.
            Mayorazgo, Ate, Lima
          </li>
        </ul>
      </section>

      <div className="legal-stamp">
        <strong>JAPG S.A.C.</strong> — RUC 20606022108<br />
        Av. Javier Prado Este Nro. 7255 Dpto. 201, Urb. Mayorazgo, Ate, Lima<br />
        hola@glup.health · +51 916 583 423
      </div>

    </LegalLayout>
  );
}
