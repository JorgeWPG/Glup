import LegalLayout from './LegalLayout';

function Num({ n }: { n: number }) {
  return <span className="legal-num">{n}</span>;
}

export default function TermsPage() {
  return (
    <LegalLayout tag="Legal · Términos de Uso" title="Términos y Condiciones de Uso">

      <div className="legal-callout legal-callout--warning">
        <span className="legal-callout__icon">⚠️</span>
        <span>
          Lea detenidamente este documento antes de usar la plataforma GLUP. Al registrarse o
          utilizar cualquier funcionalidad, usted acepta quedar vinculado por estos Términos y
          Condiciones.
        </span>
      </div>

      {/* 1 */}
      <section className="legal-section">
        <h2><Num n={1} />Identificación de la Empresa</h2>
        <p>
          <strong>JAPG S.A.C.</strong>, identificada con RUC N° 20606022108, con domicilio en
          Av. Javier Prado Este Nro. 7255 Dpto. 201, Urb. Mayorazgo, Ate, Lima, opera la
          plataforma digital <strong>GLUP</strong> accesible en{' '}
          <a href="https://glup.health" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--electrico)' }}>
            glup.health
          </a>{' '}
          (en adelante, "la Plataforma" o "GLUP").
        </p>
        <p>
          Contacto:{' '}
          <a href="mailto:hola@glup.health" style={{ color: 'var(--electrico)' }}>
            hola@glup.health
          </a>
          {' '}·{' '}
          <a href="tel:+51923544630" style={{ color: 'var(--electrico)' }}>
            +51 923 544 630
          </a>
        </p>
      </section>

      {/* 2 */}
      <section className="legal-section">
        <h2><Num n={2} />Objeto y Naturaleza del Servicio</h2>

        <h3>2.1 Descripción del servicio</h3>
        <p>GLUP es una plataforma digital de orientación en salud metabólica que ofrece:</p>
        <ul>
          <li>
            <strong>Triaje digital:</strong> cuestionario clínico estructurado que evalúa el
            perfil metabólico del usuario y genera una orientación preliminar sobre el tipo de
            atención que podría requerir.
          </li>
          <li>
            <strong>Directorio de especialistas:</strong> conexión con médicos endocrinólogos,
            nutricionistas y clínicas especializadas en tratamientos metabólicos en Lima.
          </li>
          <li>
            <strong>Gestión de citas y seguimiento:</strong> coordinación de consultas y
            comunicación entre el usuario y el profesional de salud seleccionado.
          </li>
        </ul>

        <h3>2.2 Naturaleza no sustitutiva</h3>
        <div className="legal-callout legal-callout--warning">
          <span className="legal-callout__icon">🩺</span>
          <span>
            <strong>GLUP NO es un servicio de telemedicina ni un proveedor de atención
            médica.</strong> El triaje digital y cualquier orientación generada por la Plataforma
            tienen carácter <strong>referencial e informativo</strong> y no constituyen un
            diagnóstico médico, receta, prescripción ni opinión clínica vinculante.
          </span>
        </div>
        <p>El usuario comprende y acepta que:</p>
        <ul>
          <li>
            Toda decisión sobre su salud debe tomarse en consulta con un profesional médico
            habilitado.
          </li>
          <li>
            GLUP no asume responsabilidad por las decisiones de salud que el usuario tome
            basándose exclusivamente en la orientación de la Plataforma.
          </li>
          <li>
            La relación médico-paciente se establece directamente entre el usuario y el
            profesional de salud elegido, siendo GLUP un intermediario tecnológico.
          </li>
        </ul>
      </section>

      {/* 3 */}
      <section className="legal-section">
        <h2><Num n={3} />Condiciones de Acceso y Registro</h2>

        <h3>3.1 Requisitos del usuario</h3>
        <p>Para usar GLUP usted debe:</p>
        <ul>
          <li>
            Ser <strong>mayor de 18 años</strong> o actuar bajo representación legal de un tutor
            o padre/madre para menores de edad.
          </li>
          <li>
            Proporcionar información veraz, exacta y actualizada durante el registro.
          </li>
          <li>Contar con acceso a internet y un dispositivo compatible.</li>
        </ul>

        <h3>3.2 Cuenta de usuario</h3>
        <p>
          Al registrarse, usted crea credenciales de acceso personales e intransferibles. Es su
          responsabilidad:
        </p>
        <ul>
          <li>Mantener la confidencialidad de su contraseña.</li>
          <li>
            Notificarnos de inmediato ante cualquier uso no autorizado de su cuenta a través de{' '}
            <a href="mailto:hola@glup.health" style={{ color: 'var(--electrico)' }}>
              hola@glup.health
            </a>.
          </li>
          <li>No ceder, vender ni transferir su cuenta a terceros.</li>
        </ul>
        <p>
          GLUP se reserva el derecho de suspender o cancelar cuentas que incumplan estos
          Términos, presenten información falsa o sean utilizadas de forma fraudulenta, sin
          necesidad de previo aviso y sin responsabilidad alguna frente al usuario.
        </p>
      </section>

      {/* 4 */}
      <section className="legal-section">
        <h2><Num n={4} />Uso Aceptable de la Plataforma</h2>

        <h3>4.1 Usos permitidos</h3>
        <p>El usuario puede utilizar GLUP exclusivamente para:</p>
        <ul>
          <li>
            Completar el triaje digital de salud personal o de personas bajo su tutela legal.
          </li>
          <li>Buscar y contactar profesionales de salud registrados en la Plataforma.</li>
          <li>Gestionar sus citas y comunicaciones relacionadas con su atención.</li>
        </ul>

        <h3>4.2 Usos prohibidos</h3>
        <p>Queda expresamente prohibido:</p>
        <ul>
          <li>Usar la Plataforma con fines distintos a la gestión de salud personal.</li>
          <li>Suplantar la identidad de otro usuario o de un profesional de salud.</li>
          <li>
            Introducir datos falsos, incompletos o engañosos en el triaje o en el perfil.
          </li>
          <li>
            Realizar ingeniería inversa, scraping o cualquier extracción automatizada de
            contenido de la Plataforma.
          </li>
          <li>
            Interferir con la seguridad, integridad o disponibilidad del servicio.
          </li>
          <li>Usar la Plataforma para actividades ilícitas o contrarias al orden público.</li>
          <li>
            Publicar contenido ofensivo, discriminatorio o que vulnere derechos de terceros.
          </li>
        </ul>
        <p>
          El incumplimiento de estas prohibiciones podrá dar lugar a la cancelación inmediata
          de la cuenta y, de ser el caso, a acciones legales.
        </p>
      </section>

      {/* 5 */}
      <section className="legal-section">
        <h2><Num n={5} />Responsabilidades y Limitaciones</h2>

        <h3>5.1 Responsabilidades de GLUP</h3>
        <p>GLUP se compromete a:</p>
        <ul>
          <li>
            Mantener la Plataforma operativa con un nivel de disponibilidad razonable.
          </li>
          <li>
            Proteger sus datos personales conforme al Aviso de Privacidad vigente.
          </li>
          <li>
            Garantizar que los profesionales de salud listados cuenten con registro y habilitación
            vigente ante el <strong>Colegio Médico del Perú</strong> u organismo colegiado
            correspondiente, al momento de su incorporación a la Plataforma.
          </li>
        </ul>

        <h3>5.2 Limitaciones de responsabilidad</h3>
        <p>GLUP <strong>no será responsable</strong> por:</p>
        <ul>
          <li>
            Daños derivados de decisiones médicas tomadas a partir de la orientación del triaje
            digital.
          </li>
          <li>
            Errores, omisiones o conductas de los profesionales de salud registrados, quienes
            actúan de forma independiente.
          </li>
          <li>
            Interrupciones del servicio por mantenimiento programado, fuerza mayor o fallas de
            terceros proveedores de infraestructura.
          </li>
          <li>
            Pérdida de datos atribuible a causas ajenas a GLUP (ej.: pérdida de credenciales por
            el usuario, malware en el dispositivo del usuario).
          </li>
          <li>Daños indirectos, lucro cesante o perjuicios consecuentes de cualquier naturaleza.</li>
        </ul>
        <p>
          En la máxima medida permitida por la legislación peruana, la responsabilidad total de
          GLUP frente al usuario no excederá el monto pagado por el usuario en los últimos{' '}
          <strong>3 (tres) meses</strong> previos al evento que origina el reclamo.
        </p>
      </section>

      {/* 6 */}
      <section className="legal-section">
        <h2><Num n={6} />Pagos y Facturación</h2>

        <h3>6.1 Servicios gratuitos y de pago</h3>
        <p>
          El acceso al triaje digital básico es <strong>gratuito</strong>. Determinadas
          funcionalidades premium (acceso prioritario, historial extendido, consultas en línea
          coordinadas) podrán estar sujetas a pago conforme a las tarifas publicadas en la
          Plataforma.
        </p>

        <h3>6.2 Procesamiento de pagos</h3>
        <p>
          Los pagos se procesan a través de pasarelas de pago de terceros certificadas. GLUP no
          almacena datos de tarjetas de crédito o débito. La facturación se emite conforme a las
          normas de comprobantes de pago de la <strong>SUNAT</strong>.
        </p>

        <h3>6.3 Reembolsos</h3>
        <p>
          Las solicitudes de reembolso se evaluarán caso a caso conforme a la política vigente
          publicada en la Plataforma y la <strong>Ley N° 29571</strong> (Código de Protección y
          Defensa del Consumidor).
        </p>
      </section>

      {/* 7 */}
      <section className="legal-section">
        <h2><Num n={7} />Propiedad Intelectual</h2>
        <p>
          Todos los contenidos de GLUP —incluyendo la marca, logotipos, diseño de la Plataforma,
          textos, algoritmos de triaje, bases de datos y código fuente— son propiedad de{' '}
          <strong>JAPG S.A.C.</strong> o de sus licenciantes y están protegidos por las leyes de
          propiedad intelectual del Perú y tratados internacionales aplicables.
        </p>
        <p>
          Se concede al usuario una <strong>licencia limitada, no exclusiva, no transferible y
          revocable</strong> para usar la Plataforma exclusivamente con los fines contemplados
          en estos Términos. Cualquier uso no autorizado constituye infracción susceptible de
          acción legal.
        </p>
      </section>

      {/* 8 */}
      <section className="legal-section">
        <h2><Num n={8} />Contenido Generado por el Usuario</h2>
        <p>
          Al cargar documentos, resultados de laboratorio u otro contenido en la Plataforma,
          el usuario:
        </p>
        <ul>
          <li>Garantiza tener derecho a compartir dicho contenido.</li>
          <li>
            Otorga a GLUP una licencia no exclusiva para procesar y almacenar el contenido con
            el único fin de prestar el servicio.
          </li>
          <li>
            Acepta que GLUP podrá usar datos anonimizados para mejorar sus modelos y algoritmos,
            sin identificar al usuario.
          </li>
        </ul>
      </section>

      {/* 9 */}
      <section className="legal-section">
        <h2><Num n={9} />Modificación y Terminación del Servicio</h2>
        <p>
          GLUP puede modificar, suspender o descontinuar cualquier funcionalidad de la Plataforma
          con aviso previo de <strong>15 (quince) días</strong> publicado en el sitio web, salvo
          en casos de emergencia, seguridad o cumplimiento regulatorio que requieran acción
          inmediata.
        </p>
        <p>
          El usuario puede cancelar su cuenta en cualquier momento desde la configuración de su
          perfil o escribiendo a{' '}
          <a href="mailto:hola@glup.health" style={{ color: 'var(--electrico)' }}>
            hola@glup.health
          </a>. La cancelación no genera derecho a reembolso de servicios ya prestados.
        </p>
      </section>

      {/* 10 */}
      <section className="legal-section">
        <h2><Num n={10} />Ley Aplicable y Resolución de Disputas</h2>
        <p>
          Estos Términos se rigen por las leyes de la <strong>República del Perú</strong>.
          Cualquier controversia derivada de su interpretación o ejecución se someterá, en
          primera instancia, a un proceso de negociación directa entre las partes.
        </p>
        <p>
          De no alcanzarse acuerdo en un plazo de <strong>30 (treinta) días calendario</strong>,
          las partes se someten a la jurisdicción de los{' '}
          <strong>Jueces y Tribunales de Lima Cercado</strong>, renunciando expresamente a
          cualquier otro fuero que pudiera corresponderles.
        </p>
        <p>
          Sin perjuicio de lo anterior, el usuario podrá presentar reclamos ante{' '}
          <strong>INDECOPI</strong> conforme a la Ley N° 29571.
        </p>
      </section>

      {/* 11 */}
      <section className="legal-section">
        <h2><Num n={11} />Disposiciones Generales</h2>
        <ul>
          <li>
            <strong>Divisibilidad:</strong> Si alguna cláusula resultase inválida o inaplicable,
            el resto del acuerdo permanecerá vigente.
          </li>
          <li>
            <strong>No renuncia:</strong> La falta de ejercicio de un derecho no implica su
            renuncia.
          </li>
          <li>
            <strong>Acuerdo completo:</strong> Estos Términos, junto con el Aviso de Privacidad y
            la Política de Cookies, constituyen el acuerdo íntegro entre las partes respecto al
            uso de la Plataforma.
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
