import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../../../../constants/Api';
import './CredentialsView.css';
import { Credencial, Grupo } from '../../../../constants/interfaces';
import Modal from 'react-modal';
import { saveDataOffline, getOfflineData } from '../../../../db'; 

const CredentialsView: React.FC = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [filteredCredenciales, setFilteredCredenciales] = useState<Credencial[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCredencial, setSelectedCredencial] = useState<Credencial | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Credencial | null>(null);
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const credencialesPerPage = 6

  // Búsqueda avanzada
  const [searchTerm, setSearchTerm] = useState('');

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  useEffect(() => {
    const fetchCredenciales = async () => {
      try {
        const response = await fetch(`${apiUrl}credencial_escolar`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Credencial[] = await response.json();
        setCredenciales(data);
        setFilteredCredenciales(data);

        // Guardar los datos de credenciales en IndexedDB para acceso offline
        await saveDataOffline({
          key: 'credencialesData',
          value: JSON.stringify(data),
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
        toast.error('Error al cargar las credenciales');

        // Intentar cargar datos desde IndexedDB si no hay conexión
        loadCredencialesOffline();
      }
    };

    const fetchGrupos = async () => {
      try {
        const response = await fetch(`${apiUrl}grupo`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Grupo[] = await response.json();
        setGrupos(data);

        // Guardar los datos de grupos en IndexedDB para acceso offline
        await saveDataOffline({
          key: 'gruposData',
          value: JSON.stringify(data),
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
        toast.error('Error al cargar los grupos');
      }
    };

    fetchCredenciales();
    fetchGrupos();
  }, []);
  
  const loadCredencialesOffline = async () => {
    try {
      const cachedCredenciales = await getOfflineData('credencialesData');
      if (cachedCredenciales) {
        const credencialesData = JSON.parse(cachedCredenciales.value);
        setCredenciales(credencialesData);
        setFilteredCredenciales(credencialesData);
        toast.info('Datos de credenciales cargados desde IndexedDB');
      }
    } catch (error) {
      console.error('Error al cargar los datos de credenciales desde IndexedDB:', error);
    }
  };

  useEffect(() => {
    const filtered = credenciales.filter((credencial) => {
      const matchesSearchTerm =
        credencial.nombre_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.app_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.apm_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.carrera_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.grupo_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.curp_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.nocontrol_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credencial.segsocial_credencial_escolar.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearchTerm;
    });
    setFilteredCredenciales(filtered);
  }, [searchTerm, credenciales]);

  // Logic for displaying current credenciales
  const indexOfLastCredencial = currentPage * credencialesPerPage;
  const indexOfFirstCredencial = indexOfLastCredencial - credencialesPerPage;
  const currentCredenciales = filteredCredenciales.slice(indexOfFirstCredencial, indexOfLastCredencial);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCredenciales.length / credencialesPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEditClick = (credencial: Credencial) => {
    setSelectedCredencial(credencial);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedCredencial) {
      setSelectedCredencial({
        ...selectedCredencial,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSendNotificationClick = (credencial: Credencial) => {
    setSelectedAlumno(credencial);
    setShowConfirmModal(true);
  };

  const handleSendNotification = async () => {
    if (selectedAlumno) {
      try {
        const response = await fetch(`${apiUrl}send_notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alumno_id: selectedAlumno.idalumnocrede,
            subject: notificationSubject,
            message: notificationMessage,
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        toast.success('Notificación enviada exitosamente');
        setShowConfirmModal(false);
      } catch (error) {
        console.error("Error sending notification: ", error);
        toast.error('Error al enviar la notificación');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCredencial) {
      try {
        const updatedCredencial = { ...selectedCredencial };
        // Actualizar el estado local inmediatamente
        setCredenciales(prevCredenciales =>
          prevCredenciales.map(credencial =>
            credencial.id_credencial_escolar === updatedCredencial.id_credencial_escolar ? updatedCredencial : credencial
          )
        );
        setShowModal(false);
        toast.success('Credencial actualizada exitosamente');

        // Enviar la solicitud de actualización al servidor
        const response = await fetch(`${apiUrl}credencial_escolar/update/${selectedCredencial.id_credencial_escolar}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedCredencial),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        await response.json();
      } catch (error) {
        console.error("Error updating data: ", error);
        toast.error('Error al actualizar la credencial');
      }
    }
  };

  return (
    <div className="container-credentials-view-admin">
      <ToastContainer />
      <h2>Credenciales Escolares</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por palabra clave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table-credentials-view-admin">
        <thead className="thead-credentials-view-admin">
          <tr className="tr-credentials-view-admin">
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Carrera</th>
            <th>Grupo</th>
            <th>CURP</th>
            <th>No. Control</th>
            <th>Seg. Social</th>
            <th>ID Alumno</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="tbody-credentials-view-admin">
          {currentCredenciales.length > 0 ? (
            currentCredenciales.map(credencial => (
              <tr key={credencial.id_credencial_escolar} className="tr-credentials-view-admin">
                <td>{credencial.id_credencial_escolar}</td>
                <td>{credencial.nombre_credencial_escolar}</td>
                <td>{credencial.app_credencial_escolar}</td>
                <td>{credencial.apm_credencial_escolar}</td>
                <td>{credencial.carrera_credencial_escolar}</td>
                <td>{credencial.grupo_credencial_escolar}</td>
                <td>{credencial.curp_credencial_escolar}</td>
                <td>{credencial.nocontrol_credencial_escolar}</td>
                <td>{credencial.segsocial_credencial_escolar}</td>
                <td>{credencial.idalumnocrede}</td>
                <td>
                  <button onClick={() => handleEditClick(credencial)} className="save-button">
                    Editar
                  </button>
                  <button onClick={() => handleSendNotificationClick(credencial)} className="send-notification-button">
                    Enviar Notificación
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11}>No hay credenciales disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      <nav className="nav-credentials-view-admin">
        <ul className="pagination-credentials-view-admin">
          {pageNumbers.map(number => (
            <li key={number} className="page-item-credentials-view-admin">
              <a onClick={() => paginate(number)} href="#" className="page-link-credentials-view-admin">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {showModal && selectedCredencial && (
        <div className="modal-credentials-view-admin">
          <div className="modal-content-credentials-view-admin">
            <form onSubmit={handleFormSubmit} className="credentials-view-admin-form">
              <h2>Editar Credencial</h2>
              <div className="form-group-credentials-view-admin-form">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre_credencial_escolar"
                  value={selectedCredencial.nombre_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>Apellido Paterno</label>
                <input
                  type="text"
                  name="app_credencial_escolar"
                  value={selectedCredencial.app_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>Apellido Materno</label>
                <input
                  type="text"
                  name="apm_credencial_escolar"
                  value={selectedCredencial.apm_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>Carrera</label>
                <input
                  type="text"
                  name="carrera_credencial_escolar"
                  value={selectedCredencial.carrera_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>Grupo</label>
                <select
                  name="grupo_credencial_escolar"
                  value={selectedCredencial.grupo_credencial_escolar || ''}
                  onChange={handleInputChange}
                >
                  {grupos.map(grupo => (
                    <option key={grupo.id_grupos} value={grupo.id_grupos}>
                      {grupo.nombre_grupos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>CURP</label>
                <input
                  type="text"
                  name="curp_credencial_escolar"
                  value={selectedCredencial.curp_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>No. Control</label>
                <input
                  type="text"
                  name="nocontrol_credencial_escolar"
                  value={selectedCredencial.nocontrol_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-credentials-view-admin-form">
                <label>Seg. Social</label>
                <input
                  type="text"
                  name="segsocial_credencial_escolar"
                  value={selectedCredencial.segsocial_credencial_escolar || ''}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn-submit-credentials-view-admin-form">
                Guardar
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn-close-credentials-view-admin-form">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && selectedAlumno && (
        <div className="modal-credentials-view-admin">
          <div className="help-modal-content">
            <h2>¿Está seguro que desea enviar esta notificación al alumno(a) {selectedAlumno.nombre_credencial_escolar}?</h2>
            <div className='modal-credentials-labels'>
              <label>Asunto:</label>
              <input
                type="text"
                value={notificationSubject}
                onChange={(e) => setNotificationSubject(e.target.value)}
              />
            </div>
            <br />
            <br />
            <div className='modal-credentials-labels'>
              <label>Mensaje:</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>
            <div className='align2'>
              <button onClick={handleSendNotification} className="btn-submit-credentials-view-admin-form">
                Enviar
              </button>
              <button onClick={() => setShowConfirmModal(false)} className="btn-close-credentials-view-admin-form">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isHelpModalOpen}
        onRequestClose={closeHelpModal}
        className="modal-info-alumn"
        overlayClassName="modal-overlay-info-alumn"
      >
        <div className="help-modal-content">
          <button className="help-modal-close" onClick={closeHelpModal}>
            &times;
          </button>
          <h2>Ayuda de Credencial Escolar del Alumnos</h2>
          <p>
            Para editar el alumno, debes hacerlo de esta manera:
          </p>
          <p>
            <strong>Debes dar clic en el botón de editar y en los campos hacer lo necesario</strong>
          </p>
          <p>
            Para enviar notificaciones debes de dar clic en el botón de <strong>Enviar notificación</strong>
          </p>
        </div>
      </Modal>

      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>
    </div>
  );
};

export default CredentialsView;
