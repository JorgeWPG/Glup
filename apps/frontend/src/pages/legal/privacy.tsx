import LegalLayout from './LegalLayout';

function Num({ n }: { n: number }) {
  return <span className="legal-num">{n}</span>;
}

export default function PrivacyPage() {
  return (
    <LegalLayout tag="Legal · Privacidad" title="Aviso de Privacidad">

      {/* 1 */}
      <section className="legal-section">
        <h2><Num n={1} />Identidad del Responsable del Tratamiento</h2>
        <p>
          <strong>JAPG S.A.C.</strong> (en adelante, "GLUP" o "la Empresa"), identificada con
          RUC N° 20606022108, con domicilio fiscal en Av. Javier Prado Este Nro. 7255 Dpto. 201,
          Urb. Mayorazgo, distrito de Ate, provincia y departamento de Lima, es la responsable del
          banco de datos personales que opera a través de la plataforma <strong>GLUP</strong>{' '}
          (glup.health).
        </p>
        <p>
          <strong>Contacto del área responsable de datos personales:</strong><br />
          Correo electrónico:{' '}
          <a href="mailto:hola@glup.health" style={{ color: 'var(--electrico)' }}>
            hola@glup.health
          </a>
          <br />
          Teléfono:{' '}
          <a href="tel:+51923544630" style={{ color: 'var(--electrico)' }}>
            +51 923 544 630
          </a>
        </p>
      </section>

      {/* 2 */}
      <section className="legal-section">
        <h2><Num n={2} />Marco Legal Aplicable</h2>
        <p>El presente Aviso de Privacidad se rige por:</p>
        <ul>
          <li>
            <strong>Ley N° 29733</strong> — Ley de Protección de Datos Personales del Perú
          </li>
          <li>
            <strong>D.S. N° 003-2013-JUS</strong> — Reglamento de la Ley de Protección de Datos
            Personales
          </li>
          <li>
            <strong>D.S. N° 014-2024-JUS</strong> — Modificaciones al Reglamento vigentes
          </li>
          <li>
            Demás normas complementarias emitidas por la{' '}
            <strong>Autoridad Nacional de Protección de Datos Personales (ANPDP)</strong>,
            adscrita al Ministerio de Justicia y Derechos Humanos
          </li>
        </ul>
      </section>

      {/* 3 */}
      <section className="legal-section">
        <h2><Num n={3} />Datos Personales que Recopilamos</h2>

        <h3>3.1 Datos de identificación y contacto</h3>
        <ul>
          <li>Nombre completo, fecha de nacimiento, sexo, número de DNI o pasaporte</li>
          <li>Correo electrónico y número de teléfono celular</li>
          <li>Distrito y ciudad de residencia</li>
        </ul>

        <h3>3.2 Datos sensibles de salud (Categoría Especial)</h3>
        <div className="legal-callout legal-callout--warning">
          <span className="legal-callout__icon">⚠️</span>
          <span>
            De conformidad con el artículo 13° de la Ley N° 29733, los datos de salud son
            considerados <strong>datos sensibles</strong> y reciben protección reforzada.
          </span>
        </div>
        <ul>
          <li>
            Diagnósticos médicos, antecedentes clínicos y familiares de enfermedades metabólicas
            (diabetes, obesidad, síndrome metabólico, hipotiroidismo, entre otras)
          </li>
          <li>
            Información sobre medicamentos prescritos, dosis y tratamientos en curso
          </li>
          <li>
            Resultados de exámenes de laboratorio e imágenes médicas cargados voluntariamente
          </li>
          <li>
            Indicadores biométricos: peso, talla, IMC, glucosa, HbA1c, presión arterial y demás
            biomarcadores de salud
          </li>
          <li>
            Información capturada durante el proceso de triaje digital de la plataforma
          </li>
        </ul>

        <h3>3.3 Datos de uso de la plataforma</h3>
        <ul>
          <li>Dirección IP, tipo de dispositivo y navegador, sistema operativo</li>
          <li>Páginas visitadas, duración de sesión y patrones de interacción</li>
          <li>Cookies y tecnologías de rastreo (conforme a nuestra Política de Cookies)</li>
        </ul>
      </section>

      {/* 4 */}
      <section className="legal-section">
        <h2><Num n={4} />Finalidades del Tratamiento</h2>
        <p>
          Tratamos sus datos personales para las siguientes finalidades{' '}
          <strong>necesarias para la prestación del servicio:</strong>
        </p>

        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>N°</th>
                <th>Finalidad</th>
                <th style={{ width: 210 }}>Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  Ejecutar el triaje digital de salud metabólica y orientar al usuario hacia el
                  especialista o clínica adecuada
                </td>
                <td>Ejecución del contrato / consentimiento expreso</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Crear y gestionar la cuenta de usuario en la plataforma</td>
                <td>Ejecución del contrato</td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  Facilitar la comunicación entre el usuario y los profesionales de salud
                  registrados
                </td>
                <td>Consentimiento expreso</td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  Enviar recordatorios de citas, resultados y comunicaciones relacionadas con su
                  atención
                </td>
                <td>Consentimiento expreso</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Cumplir obligaciones legales y regulatorias aplicables</td>
                <td>Obligación legal</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Garantizar la seguridad e integridad de la plataforma</td>
                <td>Interés legítimo</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Finalidades secundarias</h3>
        <p>
          Las siguientes finalidades requieren <strong>consentimiento independiente y
          revocable</strong> que usted puede otorgar o retirar en cualquier momento:
        </p>
        <ul>
          <li>
            Envío de comunicaciones comerciales, boletines y ofertas de salud personalizadas
          </li>
          <li>
            Elaboración de estadísticas agregadas y anonimizadas para investigación en salud
            pública
          </li>
          <li>
            Mejora de los algoritmos de triaje mediante aprendizaje automático (datos
            anonimizados)
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section className="legal-section">
        <h2><Num n={5} />Tratamiento de Datos Sensibles de Salud</h2>
        <p>
          En virtud del artículo 13° de la Ley N° 29733, el tratamiento de datos sensibles de
          salud solo se realiza:
        </p>
        <ol>
          <li>
            Con el <strong>consentimiento expreso, libre, previo, informado e inequívoco</strong>{' '}
            del titular, otorgado mediante aceptación electrónica verificable.
          </li>
          <li>
            Cuando sea necesario para <strong>proteger intereses vitales</strong> del titular.
          </li>
          <li>
            En cumplimiento de <strong>obligaciones y derechos</strong> en materia de salud
            pública.
          </li>
        </ol>
        <div className="legal-callout legal-callout--success">
          <span className="legal-callout__icon">🔒</span>
          <span>
            Sus datos de salud <strong>no serán vendidos</strong>, cedidos ni transferidos a
            terceros con fines comerciales ajenos a la prestación del servicio de salud. El
            acceso está restringido exclusivamente al equipo médico y técnico con necesidad
            legítima de conocimiento.
          </span>
        </div>
      </section>

      {/* 6 */}
      <section className="legal-section">
        <h2><Num n={6} />Transferencia y Encargados del Tratamiento</h2>
        <p>
          Para prestar el servicio, compartimos sus datos únicamente con:
        </p>
        <ul>
          <li>
            <strong>Médicos y clínicas</strong> registrados en GLUP, en la medida necesaria para
            su atención
          </li>
          <li>
            <strong>Proveedores tecnológicos</strong> (hosting, infraestructura en la nube, correo
            transaccional) bajo contratos de encargo de tratamiento con cláusulas de
            confidencialidad y seguridad
          </li>
          <li>
            <strong>Autoridades competentes</strong> cuando exista obligación legal expresa
          </li>
        </ul>
        <p>
          Todos los encargados del tratamiento han suscrito compromisos de confidencialidad y
          están sujetos a medidas de seguridad equivalentes a las de GLUP. No realizamos
          transferencias internacionales de datos sin garantías adecuadas conforme al artículo
          15° de la Ley N° 29733.
        </p>
      </section>

      {/* 7 */}
      <section className="legal-section">
        <h2><Num n={7} />Plazo de Conservación</h2>
        <p>
          Sus datos personales serán conservados durante el tiempo que mantenga una cuenta activa
          en GLUP y, una vez cancelada, por un período adicional de <strong>5 (cinco) años</strong>{' '}
          conforme a los plazos legales aplicables en materia de documentación médica y fiscal,
          salvo disposición legal que exija un plazo mayor.
        </p>
      </section>

      {/* 8 */}
      <section className="legal-section">
        <h2><Num n={8} />Derechos ARCO y Cómo Ejercerlos</h2>
        <p>Como titular de sus datos personales, usted tiene derecho a:</p>
        <ul>
          <li>
            <strong>Acceso:</strong> Conocer qué datos tratamos sobre usted y con qué finalidad.
          </li>
          <li>
            <strong>Rectificación:</strong> Corregir datos inexactos o incompletos.
          </li>
          <li>
            <strong>Cancelación:</strong> Solicitar la supresión de sus datos cuando ya no sean
            necesarios.
          </li>
          <li>
            <strong>Oposición:</strong> Oponerse al tratamiento para finalidades secundarias o de
            marketing.
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, envíe una solicitud escrita a{' '}
          <a href="mailto:hola@glup.health" style={{ color: 'var(--electrico)' }}>
            hola@glup.health
          </a>{' '}
          con el asunto <strong>"Derechos ARCO"</strong>, adjuntando copia de su documento de
          identidad. Responderemos dentro de los <strong>20 (veinte) días hábiles</strong>{' '}
          siguientes a la recepción de su solicitud, conforme al artículo 24° del
          D.S. N° 003-2013-JUS.
        </p>
        <div className="legal-callout legal-callout--info">
          <span className="legal-callout__icon">ℹ️</span>
          <span>
            Si considera que su solicitud no fue atendida correctamente, puede presentar una
            reclamación ante la <strong>Autoridad Nacional de Protección de Datos Personales
            (ANPDP)</strong> en:{' '}
            <a
              href="https://www.minjus.gob.pe/proteccion-de-datos-personales"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1E40AF' }}
            >
              www.minjus.gob.pe/proteccion-de-datos-personales
            </a>
          </span>
        </div>
      </section>

      {/* 9 */}
      <section className="legal-section">
        <h2><Num n={9} />Seguridad de los Datos</h2>
        <p>
          GLUP implementa medidas técnicas, organizativas y legales apropiadas para proteger sus
          datos, incluyendo:
        </p>
        <ul>
          <li>
            Cifrado en tránsito (TLS 1.2+) y en reposo para todos los datos sensibles de salud
          </li>
          <li>
            Control de acceso basado en roles (RBAC) con autenticación de doble factor para el
            personal
          </li>
          <li>Registros de auditoría y monitoreo continuo de accesos</li>
          <li>
            Procedimientos documentados de respuesta ante incidentes de seguridad
          </li>
        </ul>
        <p>
          En caso de una brecha de seguridad que afecte sus derechos, le notificaremos en el
          plazo que establezca la ANPDP.
        </p>
      </section>

      {/* 10 */}
      <section className="legal-section">
        <h2><Num n={10} />Modificaciones al Aviso de Privacidad</h2>
        <p>
          Nos reservamos el derecho de actualizar este Aviso de Privacidad. Cuando los cambios
          sean sustanciales, se lo comunicaremos por correo electrónico o mediante un aviso
          destacado en la plataforma con al menos <strong>15 días de anticipación</strong>. El
          uso continuado del servicio tras dicha notificación implica la aceptación de los cambios.
        </p>
      </section>

      <div className="legal-stamp">
        <strong>JAPG S.A.C.</strong> — RUC 20606022108<br />
        Av. Javier Prado Este Nro. 7255 Dpto. 201, Urb. Mayorazgo, Ate, Lima<br />
        hola@glup.health · +51 916 583 423
      </div>

    </LegalLayout>
  );
}
