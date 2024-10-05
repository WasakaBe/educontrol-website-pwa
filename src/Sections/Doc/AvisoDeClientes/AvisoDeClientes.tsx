import { Navbar } from "../../Public";

export default function AvisoDeClientes() {
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Aviso de Clientes de EDU CONTROL</h1>
        <p><strong>Fecha de última actualización:</strong> {fechaActual}</p>

        <h2>1. Responsabilidad del Tratamiento de Datos</h2>
        <p>
          El CBTA5 es responsable del tratamiento de los datos personales de los usuarios de EDU CONTROL. Nos aseguramos de que la información personal se maneje de acuerdo con las leyes y regulaciones de protección de datos aplicables.
        </p>

        <h2>2. Información Recopilada</h2>
        <p>
          Recopilamos los siguientes tipos de información de nuestros usuarios:
        </p>
        <ul>
          <li><strong>Datos Personales:</strong> Información como nombre, dirección de correo electrónico, número de teléfono y otros datos de contacto.</li>
          <li><strong>Datos Académicos:</strong> Información sobre el rendimiento académico, asistencias, horarios y credenciales escolares.</li>
          <li><strong>Datos de Docentes:</strong> Información relacionada con los horarios de clase, asistencia de los alumnos y materias impartidas.</li>
          <li><strong>Datos Técnicos:</strong> Información sobre el uso del sitio web, incluyendo direcciones IP, tipo de navegador, páginas visitadas y duración de la visita.</li>
        </ul>

        <h2>3. Finalidad del Tratamiento de Datos</h2>
        <p>
          Utilizamos la información recopilada para los siguientes fines:
        </p>
        <ul>
          <li><strong>Provisión de Servicios Educativos:</strong> Facilitar la gestión y el seguimiento de los datos académicos para alumnos, padres o tutores, y docentes.</li>
          <li><strong>Mejora del Sitio Web:</strong> Analizar el uso del sitio web para mejorar su funcionalidad y la experiencia del usuario.</li>
          <li><strong>Comunicación y Soporte:</strong> Responder a consultas, proporcionar soporte técnico y enviar notificaciones relacionadas con el uso del sitio.</li>
          <li><strong>Administración de Cuentas:</strong> Gestionar cuentas de usuario y permisos, así como mejorar la seguridad del sitio.</li>
        </ul>

        <h2>4. Derechos de los Usuarios</h2>
        <p>
          Los usuarios tienen los siguientes derechos con respecto a su información personal:
        </p>
        <ul>
          <li><strong>Acceso a la Información:</strong> Solicitar una copia de la información personal que tenemos sobre ellos.</li>
          <li><strong>Rectificación de Datos:</strong> Corregir cualquier información personal inexacta o incompleta.</li>
          <li><strong>Eliminación de Datos:</strong> Solicitar la eliminación de su información personal, sujeto a ciertas excepciones legales.</li>
          <li><strong>Restricción del Tratamiento:</strong> Solicitar la limitación del procesamiento de su información personal en determinadas circunstancias.</li>
        </ul>
        <p>
          Para ejercer estos derechos, los usuarios pueden contactar al administrador a través del correo electrónico: [correo del administrador].
        </p>

        <h2>5. Seguridad de la Información</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger la información personal contra el acceso no autorizado, pérdida, destrucción o alteración. Sin embargo, ninguna medida de seguridad es completamente infalible y no podemos garantizar la seguridad absoluta de la información.
        </p>

        <h2>6. Divulgación de la Información</h2>
        <p>
          No compartimos la información personal de nuestros usuarios con terceros, excepto en los siguientes casos:
        </p>
        <ul>
          <li><strong>Consentimiento del Usuario:</strong> Cuando el usuario ha dado su consentimiento expreso para compartir la información.</li>
          <li><strong>Cumplimiento Legal:</strong> Cuando sea necesario para cumplir con una obligación legal o para proteger nuestros derechos, propiedad o seguridad.</li>
          <li><strong>Proveedores de Servicios:</strong> Con terceros que prestan servicios en nuestro nombre, como alojamiento web, análisis de datos y soporte técnico, siempre que estos terceros se comprometan a mantener la confidencialidad de la información.</li>
        </ul>

        <h2>7. Cambios en este Aviso de Clientes</h2>
        <p>
          Nos reservamos el derecho de actualizar este aviso de clientes en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio web. Recomendamos a los usuarios revisar este aviso de clientes periódicamente para estar al tanto de cualquier cambio.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Para cualquier consulta o inquietud sobre este aviso de clientes o nuestras prácticas de manejo de información, los usuarios pueden contactar al administrador a través de la función de mensajería del sitio o en el correo electrónico: [correo del administrador].
        </p>

        <p><strong>Centro Bachillerato Tecnológico Agropecuario No. 5 (CBTA5)</strong></p>
      </div>
    </div>
  );
}
