import { Navbar } from "../../Public";

export default function TerminosYCondiciones() {
 const fechaActual = new Date().toLocaleDateString("es-ES", {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});
  return (
    <div>
      <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Términos y Condiciones de Uso de EDU CONTROL</h1>
        <p><strong>Fecha de última actualización:</strong> {fechaActual}</p>

        <h2>1. Definiciones</h2>
        <p>
          <strong>Institución:</strong> Se refiere al Centro Bachillerato Tecnológico Agropecuario No. 5 (CBTA5).<br />
          <strong>Sitio:</strong> Se refiere a la plataforma web EDU CONTROL.<br />
          <strong>Usuarios:</strong> Incluye a los alumnos, padres o tutores de los alumnos, y docentes que pertenecen a la institución.<br />
          <strong>Administrador:</strong> Persona encargada de la gestión completa del sitio web.
        </p>

        <h2>2. Servicios Ofrecidos</h2>
        <p>
          EDU CONTROL proporciona las siguientes funcionalidades:
        </p>
        <ul>
          <li><strong>Para Padres de Familia:</strong> Visualización de datos del alumnado, materias de clase y asistencias.</li>
          <li><strong>Para Alumnos:</strong> Visualización de horarios, asistencias, credencial escolar virtual, y envío de mensajes al administrador para notificar pérdida, extravío o caducidad de credenciales físicas.</li>
          <li><strong>Para Docentes:</strong> Gestión de horarios, adición de alumnos a clases y toma de asistencias.</li>
          <li><strong>Para el Administrador:</strong> Control total sobre la creación, actualización, visualización y eliminación de credenciales escolares, horarios escolares, y datos de alumnos y docentes. También es responsable de recibir y gestionar los mensajes enviados por los usuarios.</li>
        </ul>

        <h2>3. Uso del Sitio</h2>
        <p>
          <strong>Acceso:</strong> El sitio está destinado exclusivamente a los miembros de la institución (alumnos, padres o tutores de alumnos, y docentes).<br />
          <strong>Credenciales de Acceso:</strong> Los usuarios deben mantener la confidencialidad de sus credenciales de acceso y notificar de inmediato al administrador en caso de pérdida o sospecha de uso no autorizado.<br />
          <strong>Mensajes al Administrador:</strong> Los usuarios pueden enviar mensajes al administrador para reportar problemas relacionados con credenciales escolares.
        </p>

        <h2>4. Restricciones de Uso</h2>
        <p>
          <strong>Prohibiciones:</strong> Queda prohibido el uso del sitio para cualquier propósito ilegal o no autorizado. Los usuarios no deben intentar obtener acceso no autorizado a otras cuentas, sistemas informáticos o redes conectadas al sitio.<br />
          <strong>Contenido del Usuario:</strong> El usuario se compromete a no enviar contenido ofensivo, inapropiado o ilegal a través de las funciones de mensajería del sitio.
        </p>

        <h2>5. Responsabilidades del Administrador</h2>
        <p>
          El administrador es responsable de:
        </p>
        <ul>
          <li><strong>Gestión de Credenciales:</strong> Creación, actualización, visualización y eliminación de credenciales escolares.</li>
          <li><strong>Gestión de Horarios:</strong> Creación, actualización, visualización y eliminación de horarios escolares.</li>
          <li><strong>Gestión de Datos:</strong> Visualización y gestión de la información de alumnos, docentes, becas, etc.</li>
        </ul>

        <h2>6. Limitaciones de Responsabilidad</h2>
        <p>
          EDU CONTROL no se hace responsable de:
        </p>
        <ul>
          <li><strong>Errores Técnicos:</strong> Interrupciones del servicio, pérdida de datos o cualquier otro problema técnico que pueda ocurrir.</li>
          <li><strong>Contenido de Terceros:</strong> Información inexacta o contenido proporcionado por los usuarios del sitio.</li>
        </ul>

        <h2>7. Privacidad</h2>
        <p>
          La privacidad de nuestros usuarios es una prioridad. Toda la información personal recopilada a través del sitio se maneja de acuerdo con nuestra Política de Privacidad.
        </p>

        <h2>8. Modificaciones a los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio. Es responsabilidad del usuario revisar periódicamente estos términos para estar al tanto de cualquier cambio.
        </p>

        <h2>9. Contacto</h2>
        <p>
          Para cualquier consulta o problema relacionado con el uso del sitio, por favor contacte al administrador a través de la función de mensajería del sitio o en el correo electrónico: educontroladmin@gmail.com .
        </p>

        <p><strong>Centro Bachillerato Tecnológico Agropecuario No. 5 (CBTA5)</strong></p>
      </div>
    </div>
    </div>
  )
}
