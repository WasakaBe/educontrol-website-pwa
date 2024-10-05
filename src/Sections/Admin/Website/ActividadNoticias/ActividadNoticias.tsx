import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { apiUrl } from '../../../../constants/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Definir la interfaz para los datos de actividades y noticias
interface ActividadNoticia {
  id_actividades_noticias: number;
  titulo_actividad_noticia: string;
  imagen_actividad_noticia: string | null;
  descripcion_actividad_noticia: string;
  fecha_actividad_noticias: string;
}

interface ActividadNoticiaForm {
  titulo_actividad_noticia: string;
  imagen_actividad_noticia: File | null;
  descripcion_actividad_noticia: string;
  fecha_actividad_noticias: string;
}

export default function ActividadNoticias() {
  const [actividadesNoticias, setActividadesNoticias] = useState<ActividadNoticia[]>([]);
  const [, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [newActividad, setNewActividad] = useState<ActividadNoticiaForm>({
    titulo_actividad_noticia: '',
    imagen_actividad_noticia: null,
    descripcion_actividad_noticia: '',
    fecha_actividad_noticias: '',
  });

  useEffect(() => {
    fetchActividadesNoticias();
  }, []);

  const fetchActividadesNoticias = async () => {
    try {
      const response = await fetch(`${apiUrl}actividades_noticias`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setActividadesNoticias(data || []);
    } catch {
      setError('Error fetching actividades noticias');
      toast.error('Error fetching actividades noticias');
    }
  };

  const deleteActividadNoticia = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}actividades_noticias/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchActividadesNoticias();
      toast.success('Actividad noticia eliminada exitosamente');
    } catch {
      setError('Error deleting actividad noticia');
      toast.error('Error deleting actividad noticia');
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
      imagen_actividad_noticia: file,
    }));
  };

  const addActividadNoticia = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo_actividad_noticia', newActividad.titulo_actividad_noticia);
    formData.append('descripcion_actividad_noticia', newActividad.descripcion_actividad_noticia);
    if (newActividad.imagen_actividad_noticia) {
      formData.append('imagen_actividad_noticia', newActividad.imagen_actividad_noticia);
    }
    
    const fechaActividad = new Date(newActividad.fecha_actividad_noticias).toISOString().slice(0, 19).replace('T', ' ');
    formData.append('fecha_actividad_noticias', fechaActividad);

    try {
      const response = await fetch(`${apiUrl}actividades_noticias/insert`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchActividadesNoticias();
      setIsModalOpen(false);
      setNewActividad({
        titulo_actividad_noticia: '',
        imagen_actividad_noticia: null,
        descripcion_actividad_noticia: '',
        fecha_actividad_noticias: '',
      });
      toast.success('Actividad noticia agregada exitosamente');
    } catch {
      setError('Error agregando actividad noticia');
      toast.error('Error agregando actividad noticia');
    }
  };

  const editActividadNoticia = async (e: FormEvent) => {
    e.preventDefault();
    if (currentId === null) return;

    const formData = new FormData();
    formData.append('titulo_actividad_noticia', newActividad.titulo_actividad_noticia);
    formData.append('descripcion_actividad_noticia', newActividad.descripcion_actividad_noticia);
    if (newActividad.imagen_actividad_noticia) {
      formData.append('imagen_actividad_noticia', newActividad.imagen_actividad_noticia);
    }
    formData.append('fecha_actividad_noticias', newActividad.fecha_actividad_noticias || new Date().toISOString().slice(0, 19).replace('T', ' '));

    try {
      const response = await fetch(`${apiUrl}actividades_noticias/update/${currentId}`, {
        method: 'PUT',
        body: formData
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Network response was not ok');
      }
      fetchActividadesNoticias();
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentId(null);
      setNewActividad({
        titulo_actividad_noticia: '',
        imagen_actividad_noticia: null,
        descripcion_actividad_noticia: '',
        fecha_actividad_noticias: '',
      });
      toast.success('Actividad noticia actualizada exitosamente');
    } catch (error) {
      setError('Error actualizando actividad noticia');
      if (error instanceof Error) {
        toast.error(`Error actualizando actividad noticia: ${error.message}`);
      } else {
        toast.error('Error actualizando actividad noticia');
      }
    }
  };

  const openEditModal = (actividad: ActividadNoticia) => {
    setNewActividad({
      titulo_actividad_noticia: actividad.titulo_actividad_noticia,
      imagen_actividad_noticia: null,
      descripcion_actividad_noticia: actividad.descripcion_actividad_noticia,
      fecha_actividad_noticias: new Date(actividad.fecha_actividad_noticias).toISOString().slice(0, 16)
    });
    setCurrentId(actividad.id_actividades_noticias);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="carreras-tecnicas-admin-container ">
      <ToastContainer />
      <button  className="add-button-actividad-cultural-admin" onClick={() => {
        setIsEditing(false);
        setIsModalOpen(true);
      }}
      >Agregar Actividad/Noticia</button>
   
   <table className="carreras-tecnicas-admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Imagen</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividadesNoticias.length > 0 ? (
              actividadesNoticias.map((actividad) => (
                <tr key={actividad.id_actividades_noticias}>
                  <td>{actividad.titulo_actividad_noticia}</td>
                  <td>
                    {actividad.imagen_actividad_noticia && (
                      <img
                        src={`data:image/png;base64,${actividad.imagen_actividad_noticia}`}
                        alt={actividad.titulo_actividad_noticia}
                         className="actividad-cultural-admin-imagen"
                      />
                    )}
                  </td>
                  <td>{actividad.descripcion_actividad_noticia}</td>
                  <td>{actividad.fecha_actividad_noticias}</td>
                  <td>
                    <button className="edit-button-actividad-cultural-admin"onClick={() => openEditModal(actividad)}>Editar</button>
                    <button className="delete-button" onClick={() => deleteActividadNoticia(actividad.id_actividades_noticias)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay actividades noticias disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>

      {isModalOpen && (
      <div className="register-modal-overlay-actividad-cultural-admin">
          <div className="register-modal-content-actividad-cultural-admin">
            <form  className="form-group-actividad-cultural-admin" onSubmit={isEditing ? editActividadNoticia : addActividadNoticia}>
              <h3>{isEditing ? 'Editar' : 'Agregar'} Actividad/Noticia</h3>
              <label>
                Título:
                <input type="text" name="titulo_actividad_noticia" value={newActividad.titulo_actividad_noticia} onChange={handleInputChange} required />
              </label>
              <label>
                Imagen:
                <input type="file" name="imagen_actividad_noticia" onChange={handleImageChange} required={!isEditing} />
              </label>
              <label>
                Descripción:
                <textarea name="descripcion_actividad_noticia" value={newActividad.descripcion_actividad_noticia} onChange={handleInputChange} required></textarea>
              </label>
              <label>
                Fecha:
                <input type="datetime-local" name="fecha_actividad_noticias" value={newActividad.fecha_actividad_noticias} onChange={handleInputChange} required />
              </label>
              <div className='buttons'>
                <button type="submit" className="save-button-actividad-cultural-admin">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                <span className="cancel-button-actividad-cultural-admin"  onClick={() => setIsModalOpen(false)}>&times;</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
