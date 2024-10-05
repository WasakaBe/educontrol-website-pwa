import { Navbar } from "../../Public";

export default function Privacy() {
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Política de Privacidad de EDU CONTROL</h1>
        <p><strong>Fecha de última actualización:</strong> {fechaActual}</p>

        <h2>1. Información que Recopilamos</h2>
        <p>
          Recopilamos varios tipos de información en función de cómo interactúa con nuestro sitio web:
        </p>
        <ul>
          <li><strong>Información Personal:</strong> Incluye nombre, dirección de correo electrónico, número de teléfono y cualquier otra información que usted proporcione voluntariamente.</li>
          <li><strong>Información del Alumnado:</strong> Datos sobre el rendimiento académico, asistencia, horarios y credenciales escolares.</li>
          <li><strong>Información de los Docentes:</strong> Datos relacionados con horarios de clases, asistencia de los alumnos y materias impartidas.</li>
          <li><strong>Información Técnica:</strong> Datos de uso del sitio web, como dirección IP, tipo de navegador, páginas visitadas y duración de la visita.</li>
        </ul>

        <h2>2. Uso de la Información</h2>
        <p>
          Utilizamos la información recopilada para los siguientes propósitos:
        </p>
        <ul>
          <li><strong>Proveer Servicios:</strong> Facilitar la gestión de datos académicos para alumnos, padres o tutores y docentes.</li>
          <li><strong>Mejorar el Sitio:</strong> Analizar cómo se usa el sitio para mejorar su funcionalidad y experiencia del usuario.</li>
          <li><strong>Comunicación:</strong> Responder a consultas, proporcionar soporte técnico y enviar notificaciones relacionadas con el uso del sitio.</li>
          <li><strong>Administración del Sitio:</strong> Gestionar cuentas de usuario y permisos, así como mejorar la seguridad del sitio.</li>
        </ul>

        <h2>3. Divulgación de la Información</h2>
        <p>
          No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los siguientes casos:
        </p>
        <ul>
          <li><strong>Con su Consentimiento:</strong> Cuando usted ha dado su consentimiento expreso para compartir la información.</li>
          <li><strong>Para Cumplir con la Ley:</strong> Cuando sea necesario para cumplir con una obligación legal o para proteger nuestros derechos, propiedad o seguridad.</li>
          <li><strong>Con Proveedores de Servicios:</strong> Con terceros que prestan servicios en nuestro nombre, como alojamiento web, análisis de datos y soporte técnico, siempre que estos terceros se comprometan a mantener la confidencialidad de su información.</li>
        </ul>

        <h2>4. Seguridad de la Información</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra el acceso no autorizado, pérdida, destrucción o alteración. Sin embargo, ninguna medida de seguridad es completamente infalible y no podemos garantizar la seguridad absoluta de su información.
        </p>

        <h2>5. Sus Derechos</h2>
        <p>
          Usted tiene el derecho de:
        </p>
        <ul>
          <li><strong>Acceder a su Información:</strong> Solicitar una copia de la información personal que tenemos sobre usted.</li>
          <li><strong>Rectificar su Información:</strong> Corregir cualquier información personal inexacta o incompleta.</li>
          <li><strong>Eliminar su Información:</strong> Solicitar la eliminación de su información personal, sujeto a ciertas excepciones legales.</li>
          <li><strong>Restringir el Procesamiento:</strong> Solicitar la limitación del procesamiento de su información personal en determinadas circunstancias.</li>
        </ul>
        <p>
          Para ejercer estos derechos, por favor contacte al administrador a través del correo electrónico: [correo del administrador].
        </p>

        <h2>6. Cambios en esta Política de Privacidad</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio web. Le recomendamos revisar esta política de privacidad periódicamente para estar al tanto de cualquier cambio.
        </p>

        <h2>7. Contacto</h2>
        <p>
          Si tiene alguna pregunta o inquietud sobre esta política de privacidad o nuestras prácticas de manejo de información, por favor contacte al administrador a través de la función de mensajería del sitio o en el correo electrónico: [correo del administrador].
        </p>

        <p><strong>Centro Bachillerato Tecnológico Agropecuario No. 5 (CBTA5)</strong></p>
      </div>
    </div>
  );
}
