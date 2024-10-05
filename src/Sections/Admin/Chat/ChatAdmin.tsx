import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../constants/Api';
import './ChatAdmin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MensajeContacto,
  MensajeContactoAPI,
  MensajeMotivoCredencialAPI,
} from '../../../constants/interfaces';

const ChatAdmin: React.FC = () => {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const messagesPerPage = 5;

  useEffect(() => {
    const fetchData = async <T,>(
      url: string,
      mapFunction: (data: T[]) => MensajeContacto[]
    ) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error fetching data from ${url}`);
        }
        const data: T[] = await response.json();
        const mappedData = mapFunction(data);

        // Elimina duplicados antes de actualizar el estado
        setMensajes((prevMensajes) => {
          const newMensajes = [...prevMensajes, ...mappedData];
          const uniqueMensajes = newMensajes.filter(
            (mensaje, index, self) =>
              index === self.findIndex(
                (m) => m.id === mensaje.id && m.tipo === mensaje.tipo
              )
          );
          return uniqueMensajes;
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Carga mensajes de contacto
    fetchData<MensajeContactoAPI>(`${apiUrl}mensaje_contacto`, (data) =>
      data.map((mensaje) => ({
        id: mensaje.id_mensaje_contacto,
        nombre: mensaje.nombre_mensaje_contacto,
        correo: mensaje.correo_mensaje_contacto,
        motivo: mensaje.motivo_mensaje_contacto,
        fecha: mensaje.fecha_mensaje,
        tipo: 'contacto',
      }))
    );

    // Carga mensajes de motivo de credencial
    fetchData<MensajeMotivoCredencialAPI>(`${apiUrl}mensaje_motivo_credencial`, (data) =>
      data.map((mensaje) => ({
        id: mensaje.id_mensajes_motivo_credencial,
        nombre: mensaje.nombre_alumnos,
        app: mensaje.app_alumnos,
        apm: mensaje.apm_alumnos,
        correo: mensaje.correo_usuario,
        motivo: mensaje.nombre_motivo_credencial,
        fecha: mensaje.fecha_motivo_credencial,
        tipo: 'motivo credencial',
      }))
    );
  }, []);

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = mensajes.slice(indexOfFirstMessage, indexOfLastMessage);

  const totalPages = Math.ceil(mensajes.length / messagesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteClick = (messageId: number) => {
    setMessageToDelete(messageId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (messageToDelete !== null) {
      const messageToDeleteObj = mensajes.find(
        (message) => message.id === messageToDelete
      );

      // Asegúrate de que el mensaje que quieres eliminar sea el correcto
      if (!messageToDeleteObj) return;

      const apiEndpoint =
        messageToDeleteObj.tipo === 'contacto'
          ? `${apiUrl}mensaje_contacto/${messageToDelete}`
          : `${apiUrl}mensaje_motivo_credencial/${messageToDelete}`;

      try {
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Elimina solo el mensaje que seleccionaste
        setMensajes((prevMensajes) =>
          prevMensajes.filter((message) => message.id !== messageToDelete)
        );
        toast.success('Mensaje eliminado exitosamente.');
      } catch (error) {
        console.error(`Error deleting message with id ${messageToDelete}: `, error);
      } finally {
        setShowModal(false);
        setMessageToDelete(null);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Mensajes</h2>
      </div>
      {loading ? (
        <p className="loading">Cargando...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <>
          {currentMessages.length > 0 ? (
            currentMessages.map((mensaje) => (
              <div key={mensaje.id} className="message-item">
                <span className="message-icon">
                  {mensaje.tipo === 'contacto' ? '✉️' : '🎫'}
                </span>
                <div className="message-info">
                  <h3>
                    {mensaje.nombre} {mensaje.app} {mensaje.apm}
                  </h3>
                  <p>{mensaje.motivo}</p>
                  <p>{mensaje.correo}</p>
                </div>
                <div className="message-date">
                  {new Date(mensaje.fecha).toLocaleString()}
                </div>
                <button
                  className="delete-icon"
                  onClick={() => handleDeleteClick(mensaje.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p>No hay mensajes</p>
          )}
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
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Desea eliminar este mensaje?</p>
            <button onClick={handleConfirmDelete} className="accept-button">
              Aceptar
            </button>
            <button onClick={() => setShowModal(false)} className="cancell-button">
              Cancelar
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ChatAdmin;
