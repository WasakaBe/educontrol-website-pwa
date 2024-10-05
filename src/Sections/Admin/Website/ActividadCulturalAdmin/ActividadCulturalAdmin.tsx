import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../../../../constants/Api';
import './ActividadCulturalAdmin.css'

interface ActividadCultural {
  id_actividad_cultural: number;
  nombre_actividad_cultural: string;
  descripcion_actividad_cultural: string;
  imagen_actividad_cultural: string;
}

interface NewActividadCultural {
  nombre_actividad_cultural: string;
  descripcion_actividad_cultural: string;
  imagen_actividad_cultural: File | null;
}

const ActividadCulturalAdmin: React.FC = () => {
  const [actividades, setActividades] = useState<ActividadCultural[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [newActividad, setNewActividad] = useState<NewActividadCultural>({
    nombre_actividad_cultural: '',
    descripcion_actividad_cultural: '',
    imagen_actividad_cultural: null,
  });

  const itemsPerPage = 4;

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    try {
      const response = await fetch(`${apiUrl}actividades_culturales`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: ActividadCultural[] = await response.json();
      setActividades(data);
    } catch {
      toast.error('Error al cargar actividades culturales');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewActividad((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewActividad((prev) => ({
      ...prev,
      imagen_actividad_cultural: file,
    }));
  };

  const addActividadCultural = async () => {
    const formData = new FormData();
    formData.append('nombre_actividad_cultural', newActividad.nombre_actividad_cultural);
    formData.append('descripcion_actividad_cultural', newActividad.descripcion_actividad_cultural);
    if (newActividad.imagen_actividad_cultural) {
      formData.append('imagen_actividad_cultural', newActividad.imagen_actividad_cultural);
    }

    try {
      const response = await fetch(`${apiUrl}actividades_culturales/insert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchActividades();
      setIsModalOpen(false);
      setNewActividad({
        nombre_actividad_cultural: '',
        descripcion_actividad_cultural: '',
        imagen_actividad_cultural: null,
      });
      toast.success('Actividad cultural agregada exitosamente');
    } catch  {
      toast.error('Error al agregar actividad cultural');
    }
  };

  const updateActividadCultural = async (id: number) => {
    const formData = new FormData();
    formData.append('nombre_actividad_cultural', newActividad.nombre_actividad_cultural);
    formData.append('descripcion_actividad_cultural', newActividad.descripcion_actividad_cultural);
    if (newActividad.imagen_actividad_cultural) {
      formData.append('imagen_actividad_cultural', newActividad.imagen_actividad_cultural);
    }

    try {
      const response = await fetch(`${apiUrl}actividades_culturales/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchActividades();
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentId(null);
      setNewActividad({
        nombre_actividad_cultural: '',
        descripcion_actividad_cultural: '',
        imagen_actividad_cultural: null,
      });
      toast.success('Actividad cultural actualizada exitosamente');
    } catch  {
      toast.error('Error al actualizar actividad cultural');
    }
  };

  const deleteActividadCultural = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}actividades_culturales/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchActividades();
      toast.success('Actividad cultural eliminada exitosamente');
    } catch  {
      toast.error('Error al eliminar actividad cultural');
    }
  };

  const openEditModal = (actividad: ActividadCultural) => {
    setNewActividad({
      nombre_actividad_cultural: actividad.nombre_actividad_cultural,
      descripcion_actividad_cultural: actividad.descripcion_actividad_cultural,
      imagen_actividad_cultural: null,
    });
    setCurrentId(actividad.id_actividad_cultural);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < Math.ceil(actividades.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedActividades = actividades.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="actividad-cultural-admin-container">
      <ToastContainer />
      <button
        className="add-button-actividad-cultural-admin"
        onClick={() => {
          setIsEditing(false);
          setIsModalOpen(true);
        }}
      >
        Agregar Actividad Cultural
      </button>
      <table  className="add-button-actividad-cultural-admin">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {selectedActividades.length > 0 ? (
            selectedActividades.map((actividad) => (
              <tr key={actividad.id_actividad_cultural}>
                <td>{actividad.nombre_actividad_cultural}</td>
                <td>{actividad.descripcion_actividad_cultural}</td>
                <td>
                  {actividad.imagen_actividad_cultural && (
                    <img
                      src={`data:image/png;base64,${actividad.imagen_actividad_cultural}`}
                      alt={actividad.nombre_actividad_cultural}
                      className="actividad-cultural-admin-imagen"
                    />
                  )}
                </td>
                <td>
                  <button className="edit-button-actividad-cultural-admin" onClick={() => openEditModal(actividad)}>
                    Editar
                  </button>
                  <button className="delete-button-actividad-cultural-admin" onClick={() => deleteActividadCultural(actividad.id_actividad_cultural)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No hay actividades culturales disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination-actividad-cultural-admin">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {Math.ceil(actividades.length / itemsPerPage)}
        </span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === Math.ceil(actividades.length / itemsPerPage)}>
          Siguiente
        </button>
      </div>

      {isModalOpen && (
        <div className="register-modal-overlay-actividad-cultural-admin">
          <div className="register-modal-content-actividad-cultural-admin">
            <form
              className="form-group-actividad-cultural-admin"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (isEditing && currentId) {
                  updateActividadCultural(currentId);
                } else {
                  addActividadCultural();
                }
                
              }}
            >
              <h3>{isEditing ? 'Editar' : 'Agregar'} Actividad Cultural</h3>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_actividad_cultural"
                  value={newActividad.nombre_actividad_cultural}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Imagen:
                <input
                  type="file"
                  name="imagen_actividad_cultural"
                  onChange={handleImageChange}
                  required={!isEditing}
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="descripcion_actividad_cultural"
                  value={newActividad.descripcion_actividad_cultural}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </label>
              <button type="submit" className="save-button-actividad-cultural-admin">
                {isEditing ? 'Actualizar' : 'Agregar'}
              </button>
              <span className="cancel-button-actividad-cultural-admin" onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActividadCulturalAdmin;
