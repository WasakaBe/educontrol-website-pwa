import { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './InfoAlumnoFamiliar.css';
import { apiUrl } from '../../../constants/Api';
import { Alumnos, Notificacion_Alumno, HorarioAlumno } from '../../../constants/interfaces'; // Importar las interfaces
import { AuthContext } from '../../../Auto/Auth';

Modal.setAppElement('#root'); // Ajusta el selector al contenedor principal de tu aplicación

export default function InfoAlumnoFamiliar() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = authContext;
  const [nocontrol, setNocontrol] = useState('');
  const [alumno, setAlumno] = useState<Alumnos | null>(null);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
  const [notificacionesModalIsOpen, setNotificacionesModalIsOpen] = useState(false);
  const [horarioModalIsOpen, setHorarioModalIsOpen] = useState(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false); // Nuevo estado
  const [alumnosAgregados, setAlumnosAgregados] = useState<Alumnos[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion_Alumno[]>([]);
  const [asignaturas, setAsignaturas] = useState<HorarioAlumno[]>([]);
  const [alumnoToDelete, setAlumnoToDelete] = useState<Alumnos | null>(null); // Estado para el alumno a eliminar

  useEffect(() => {
    if (user) {
      fetch(`${apiUrl}alumnos_agregados/view/${user.id_usuario}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAlumnosAgregados(data);
          } else {
            console.error('Data received is not an array', data);
          }
        })
        .catch(error => console.error('Error al cargar alumnos agregados:', error));
    }
  }, [user]);

  const buscarAlumno = async () => {
    try {
      const response = await fetch(`${apiUrl}alumnos/nocontrol/${nocontrol}`);
      if (!response.ok) {
        throw new Error('Alumno no encontrado');
      }
      const data: Alumnos = await response.json();
      setAlumno(data);
      setError('');
      setModalIsOpen(true); // Abrir el modal cuando se encuentre el alumno
    } catch {
      setError('Alumno no encontrado');
      setAlumno(null);
      setModalIsOpen(false); // Cerrar el modal en caso de error
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const agregarAlumno = () => {
    if (alumno && user) {
      fetch(`${apiUrl}alumnos_agregados/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          id_alumno: alumno.id_alumnos
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar alumno');
        }
        setAlumnosAgregados([...alumnosAgregados, alumno]);
        closeModal();
      })
      .catch(error => console.error('Error al agregar alumno:', error));
    }
  };

  const openDetailsModal = (al: Alumnos) => {
    setAlumno(al);
    setDetailsModalIsOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalIsOpen(false);
  };

  const openNotificacionesModal = (al: Alumnos) => {
    setAlumno(al);
    fetch(`${apiUrl}notificaciones/${al.id_alumnos}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se encontraron notificaciones');
        }
        return response.json();
      })
      .then(data => {
        // Filtrar solo las notificaciones de asistencia
        const notificacionesAsistencia = data.filter((notificacion: Notificacion_Alumno) => notificacion.subject_notificacion.includes('Asistencia'));
        setNotificaciones(notificacionesAsistencia);
        setNotificacionesModalIsOpen(true);
      })
      .catch(error => {
        console.error('Error al obtener notificaciones:', error);
        setNotificaciones([]);
        setNotificacionesModalIsOpen(true);
      });
  };

  const closeNotificacionesModal = () => {
    setNotificacionesModalIsOpen(false);
  };

  const obtenerAsignaturas = (id_alumno: number) => {
    fetch(`${apiUrl}asignatura/horario/escolar/${id_alumno}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se encontraron asignaturas');
        }
        return response.json();
      })
      .then(data => {
        setAsignaturas(data.asignaturas);
        setHorarioModalIsOpen(true);
      })
      .catch(error => {
        console.error('Error al obtener asignaturas:', error);
        setAsignaturas([]);
        setHorarioModalIsOpen(true);
      });
  };

  const closeHorarioModal = () => {
    setHorarioModalIsOpen(false);
  };

  const confirmDeleteAlumno = (al: Alumnos) => {
    setAlumnoToDelete(al);
    setConfirmDeleteModalIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(false);
    setAlumnoToDelete(null);
  };

  const eliminarAlumnoConfirmed = () => {
    if (!user || !alumnoToDelete) {
      throw new Error('Usuario no autenticado o alumno no seleccionado');
    }

    fetch(`${apiUrl}alumnos_agregados/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_alumno: alumnoToDelete.id_alumnos
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al eliminar alumno');
      }
      setAlumnosAgregados(alumnosAgregados.filter(al => Number(al.id_alumnos) !== Number(alumnoToDelete?.id_alumnos)));
      closeConfirmDeleteModal();
      closeDetailsModal();
    })
    .catch(error => console.error('Error al eliminar alumno:', error));
  };

  const settings = {
    dots: true,
    infinite: asignaturas.length > 1, 
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="info-alumno-familiar">
      <h1>Información del Alumno</h1>
      <div className="search-section">
        <input 
          type="text" 
          value={nocontrol}
          onChange={(e) => setNocontrol(e.target.value)}
          placeholder="Número de control" 
        />
        <button onClick={buscarAlumno}>Buscar</button>
      </div>
      {error && <p className="error">{error}</p>}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Información del Alumno"
        className="modal-familiar-info"
        overlayClassName="overlay-familiar-info"
      >
        {alumno && (
          <div className="card">
            <div className="card-header" style={{ backgroundImage: `url(data:image/jpeg;base64,${alumno.foto_usuario})` }}>
            </div>
            <div className="card-body">
              <h2>{alumno.nombre_alumnos} {alumno.app_alumnos} {alumno.apm_alumnos}</h2>
              <p className="title">{alumno.carrera_tecnica}</p>
              <div className="info-section">
                <p>{alumno.grado} º {alumno.grupo}</p>
              </div>
            </div>
          </div>
        )}
        <br />
        <div className="align2">
          <button onClick={closeModal} className="exit-button">Cerrar</button>
          <button onClick={agregarAlumno} className="edit-button">Agregar</button>
        </div>
      </Modal>
      <div className="alumnos-agregados">
        {alumnosAgregados.map((al, index) => (
          <div key={`${al.id_alumnos}-${index}`} className="card">
            <div className="card-header" style={{ backgroundImage: `url(data:image/jpeg;base64,${al.foto_usuario})` }}>
            </div>
            <div className="card-body">
              <h2>{al.nombre_alumnos} {al.app_alumnos} {al.apm_alumnos}</h2>
              <p className="title">{al.carrera_tecnica}</p>
              <div className="info-section">
                <p>{al.grado} º {al.grupo}</p>
              </div>
              <div className="align2">
                <button onClick={() => openDetailsModal(al)} className="edit-button">Ver Detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={detailsModalIsOpen}
        onRequestClose={closeDetailsModal}
        contentLabel="Detalles del Alumno"
        className="modal-familiar-info"
        overlayClassName="overlay-familiar-info"
      >
        {alumno && (
          <div>
            <h2>Opciones para {alumno.nombre_alumnos}</h2>
            <button className="save-button" onClick={() => obtenerAsignaturas(Number(alumno.id_alumnos))}>Ver horario del alumno {alumno.nombre_alumnos}</button>
            <br /><br />
            <button className="save-button" onClick={() => openNotificacionesModal(alumno)}>Notificaciones de asistencias del alumno {alumno.nombre_alumnos}</button>
            <br /><br />
            <button className="save-button" onClick={() => confirmDeleteAlumno(alumno)}>Eliminar</button>
            <br /><br />
            <button className="exit-button" onClick={closeDetailsModal}>Cerrar</button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={horarioModalIsOpen}
        onRequestClose={closeHorarioModal}
        contentLabel="Horario del Alumno"
        className="modal-noti-info2"
        overlayClassName="overlay-familiar-info"
      >
        <h2>Horario del Alumno {alumno && alumno.nombre_alumnos}</h2>
        {asignaturas.length > 0 ? (
          <Slider {...settings}>
            {asignaturas.map(asignatura => (
              <div key={asignatura.id_horario_alumno} className="notificacion-card asignatura-card">
                <h3>Asignatura: {asignatura.nombre_asignatura}</h3>
                <p>Docente: {asignatura.nombre_docente}</p>
                <p>Carrera Técnica: {asignatura.nombre_carrera_tecnica}</p>
                <p>Ciclo Escolar: {asignatura.ciclo_escolar}</p>
                <p>Días:</p>
                <ul>
                  {asignatura.dias_horarios.map((dia, index) => (
                    <li key={index}>{dia.day}: {dia.startTime} - {dia.endTime}</li>
                  ))}
                </ul>
              
              </div>
            ))}
          </Slider>
        ) : (
          <p>No hay asignaturas disponibles.</p>
        )}
        <br />
        <button className="exit-button" onClick={closeHorarioModal}>Cerrar</button>
      </Modal>

      <Modal
        isOpen={notificacionesModalIsOpen}
        onRequestClose={closeNotificacionesModal}
        contentLabel="Notificaciones del Alumno"
        className="modal-noti-info"
        overlayClassName="overlay-familiar-info"
      >
        <h2>Notificaciones de Asistencias del Alumno {alumno && alumno.nombre_alumnos}</h2>
        {notificaciones.length > 0 ? (
          <Slider {...settings}>
            {notificaciones.map(notificacion => (
              <div key={notificacion.id_notificacion} className="notificacion-card">
                <h3>{notificacion.subject_notificacion}</h3>
                <p>{notificacion.message_notificacion}</p>
                <p><small>{new Date(notificacion.fecha_notificaciones).toLocaleDateString()}</small></p>
              </div>
            ))}
          </Slider>
        ) : (
          <p>No hay notificaciones disponibles.</p>
        )}
        <br />
        <button className="exit-button" onClick={closeNotificacionesModal}>Cerrar</button>
      </Modal>

      <Modal
        isOpen={confirmDeleteModalIsOpen}
        onRequestClose={closeConfirmDeleteModal}
        contentLabel="Confirmar Eliminación"
        className="modal-familiar-info"
        overlayClassName="overlay-familiar-info"
      >
        {alumnoToDelete && (
          <div className="card">
            <div className="card-body">
              <h2>¿Seguro que desea eliminar al alumno {alumnoToDelete.nombre_alumnos}?</h2>
              <div className="align2">
                <button onClick={eliminarAlumnoConfirmed} className="save-button">Eliminar</button>
                <button onClick={closeConfirmDeleteModal} className="exit-button">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
