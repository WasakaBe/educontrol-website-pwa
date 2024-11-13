import React, { useState, useEffect, useContext } from 'react';
import { apiUrl } from '../../../constants/Api';
import './NotificationAlumn.css';
import { AuthContext } from '../../../Auto/Auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Notificacion {
  id_notificacion: number;
  subject_notificacion: string;
  message_notificacion: string;
  fecha_notificaciones: string;
}

const NotificationAlumn: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alumnoId, setAlumnoId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const notificationsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchAlumnoId = async () => {
      if (!authContext || !authContext.user) {
        toast.error('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/alumno/usuario/${authContext.user.id_usuario}`);
        if (!response.ok) {
          throw new Error('Error al obtener el ID del alumno');
        }
        const data = await response.json();
        if (data && data.id_alumnos) {
          setAlumnoId(data.id_alumnos);
        } else {
          throw new Error('El ID del alumno no se pudo encontrar en la respuesta');
        }
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchAlumnoId();
  }, [authContext]);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (!alumnoId) return;

      try {
        const response = await fetch(`${apiUrl}/notificaciones/${alumnoId}`);
        if (!response.ok) {
          throw new Error('Error al obtener las notificaciones');
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setNotificaciones(data);
          setFilteredNotificaciones(data);
        } else {
          throw new Error('Los datos de notificaciones no son un array.');
        }
      } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, [alumnoId]);

  useEffect(() => {
    const filtered = notificaciones.filter((notificacion) => {
      const matchesSearchTerm =
        notificacion.subject_notificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notificacion.message_notificacion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStartDate = startDate ? new Date(notificacion.fecha_notificaciones) >= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(notificacion.fecha_notificaciones) <= new Date(endDate) : true;
      return matchesSearchTerm && matchesStartDate && matchesEndDate;
    });
    setFilteredNotificaciones(filtered);
  }, [searchTerm, startDate, endDate, notificaciones]);

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotificaciones.slice(indexOfFirstNotification, indexOfLastNotification);
  const totalPages = Math.ceil(filteredNotificaciones.length / notificationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="loading">Cargando notificaciones...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-notifications-alumn">
      <ToastContainer />
      <div className="notifications-header">
        <h2>Notificaciones</h2>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por palabra clave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha de inicio"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha de fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {filteredNotificaciones.length === 0 ? (
        <p className="no-notifications">No tienes notificaciones.</p>
      ) : (
        <>
          <div className="notification-list">
            {currentNotifications.map((notificacion) => (
              <div key={notificacion.id_notificacion} className="notification-item">
                <div className="notification-info">
                  <h3>{notificacion.subject_notificacion}</h3>
                  <p>{notificacion.message_notificacion}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <span
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`page-link ${index + 1 === currentPage ? 'active' : ''}`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationAlumn;
