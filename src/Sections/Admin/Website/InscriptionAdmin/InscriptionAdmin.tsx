import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './InscriptionAdmin.css';
import { apiUrl } from '../../../../constants/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Definir la interfaz para los datos de inscripción
interface Inscription {
  id_info_inscription: number;
  txt_info_inscription: string;
  requeriments_info_inscription: string;
  periodo_info_inscripcion: string;
  imagen_info_inscription: string | null;
}

// Definir la interfaz para el formulario de inscripción
interface InscriptionForm {
  txt_info_inscription: string;
  requeriments_info_inscription: string;
  periodo_info_inscripcion: string;
  imagen_info_inscription: File | null;
}

export default function InscriptionAdmin() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInscription, setNewInscription] = useState<InscriptionForm>({
    txt_info_inscription: '',
    requeriments_info_inscription: '',
    periodo_info_inscripcion: '',
    imagen_info_inscription: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    try {
      const response = await fetch(`${apiUrl}info_inscription`);
      if (!response.ok) {
        toast.error(`Network response was not ok: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setInscriptions(data || []);
    } catch {
      toast.error('Error fetching inscriptions');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInscription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewInscription((prev) => ({
      ...prev,
      imagen_info_inscription: file,
    }));
  };

  const addOrUpdateInscription = async (e: FormEvent) => {
    e.preventDefault();
    const url = isEditing
      ? `${apiUrl}info_inscription/update/${currentId}`
      : `${apiUrl}info_inscription/insert`;
    const method = isEditing ? 'PUT' : 'POST';
    
    const formData = new FormData();
    formData.append('txt_info_inscription', newInscription.txt_info_inscription);
    formData.append('requeriments_info_inscription', newInscription.requeriments_info_inscription);
    formData.append('periodo_info_inscripcion', newInscription.periodo_info_inscripcion);
    if (newInscription.imagen_info_inscription) {
      formData.append('imagen_info_inscription', newInscription.imagen_info_inscription);
    }

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) {
        toast.error(`Network response was not ok: ${response.statusText}`);
        return;
      }
      fetchInscriptions();
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentId(null);
      setNewInscription({
        txt_info_inscription: '',
        requeriments_info_inscription: '',
        periodo_info_inscripcion: '',
        imagen_info_inscription: null,
      });
      toast.success(`Inscription ${isEditing ? 'updated' : 'added'} successfully`);
    } catch  {
      toast.error(`Error ${isEditing ? 'updating' : 'adding'} inscription`);
    }
  };

  const deleteInscription = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}info_inscription/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toast.error(`Network response was not ok: ${response.statusText}`);
        return;
      }
      fetchInscriptions();
      toast.success('Inscription deleted successfully');
    } catch {
      toast.error('Error deleting inscription');
    }
  };

  const openEditModal = (inscription: Inscription) => {
    setNewInscription({
      txt_info_inscription: inscription.txt_info_inscription,
      requeriments_info_inscription: inscription.requeriments_info_inscription,
      periodo_info_inscripcion: inscription.periodo_info_inscripcion,
      imagen_info_inscription: null,
    });
    setCurrentId(inscription.id_info_inscription);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="inscription-admin-container">
      <ToastContainer />
      <button className="add-button" onClick={() => {
        setIsEditing(false);
        setIsModalOpen(true);
      }}>Agregar Inscripción</button>
      <div className="table-container">
        <table className="inscription-table">
          <thead>
            <tr>
              <th>Texto</th>
              <th>Requisitos</th>
              <th>Periodo</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.length > 0 ? (
              inscriptions.map((inscription) => (
                <tr key={inscription.id_info_inscription}>
                  <td>{inscription.txt_info_inscription}</td>
                  <td>{inscription.requeriments_info_inscription}</td>
                  <td>{inscription.periodo_info_inscripcion}</td>
                  <td>
                    {inscription.imagen_info_inscription && (
                      <img
                        src={`data:image/png;base64,${inscription.imagen_info_inscription}`}
                        alt="Inscription"
                        className="inscription-image"
                      />
                    )}
                  </td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => openEditModal(inscription)}>Editar</button>
                    <button className="delete-button" onClick={() => deleteInscription(inscription.id_info_inscription)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay inscripciones disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="register-modal-overlay">
          <div className="register-modal-content">
            <form className="form-group" onSubmit={addOrUpdateInscription}>
              <h3>{isEditing ? 'Editar' : 'Agregar'} Inscripción</h3>
              <label>
                Texto:
                <textarea name="txt_info_inscription" value={newInscription.txt_info_inscription} onChange={handleInputChange} required></textarea>
              </label>
              <label>
                Requisitos:
                <textarea name="requeriments_info_inscription" value={newInscription.requeriments_info_inscription} onChange={handleInputChange} required></textarea>
              </label>
              <label>
                Periodo:
                <textarea name="periodo_info_inscripcion" value={newInscription.periodo_info_inscripcion} onChange={handleInputChange} required></textarea>
              </label>
              <label>
                Imagen:
                <input type="file" name="imagen_info_inscription" onChange={handleImageChange} required={!isEditing} />
              </label>
              <button type="submit" className="save-button">{isEditing ? 'Actualizar' : 'Agregar'}</button>
              <span className="cancel-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
