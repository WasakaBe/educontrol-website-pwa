import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { apiUrl } from '../../../../constants/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CarrerasTecnicasAdmin.css'
// Definir la interfaz para los datos de Carrera Técnica
interface CarreraTecnica {
  id_carrera_tecnica: number;
  nombre_carrera_tecnica: string;
  descripcion_carrera_tecnica: string;
  foto_carrera_tecnica: string | null;
}

// Definir la interfaz para el formulario de Carrera Técnica
interface CarreraTecnicaForm {
  nombre_carrera_tecnica: string;
  descripcion_carrera_tecnica: string;
  foto_carrera_tecnica: string | null;
}

export default function CarrerasTecnicasAdmin() {
  const [carreras, setCarreras] = useState<CarreraTecnica[]>([]);
  const [newCarrera, setNewCarrera] = useState<CarreraTecnicaForm>({
    nombre_carrera_tecnica: '',
    descripcion_carrera_tecnica: '',
    foto_carrera_tecnica: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchCarreras();
  }, []);

  const fetchCarreras = async () => {
    try {
      const response = await fetch(`${apiUrl}carreras/tecnicas`);
      const data = await response.json();
      setCarreras(data.carreras);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error fetching carreras técnicas: ${error.message}`);
      } else {
        toast.error('Error fetching carreras técnicas');
      }
      
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCarrera((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCarrera((prev) => ({
          ...prev,
          foto_carrera_tecnica: reader.result ? reader.result.toString().split(',')[1] : null,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addCarreraTecnica = async () => {
    try {
      const response = await fetch(`${apiUrl}carreras/tecnicas/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCarrera),
      });

      if (!response.ok) {
        toast.error('Network response was not ok');
        return;
      }
      fetchCarreras();
      setIsModalOpen(false);
      setNewCarrera({
        nombre_carrera_tecnica: '',
        descripcion_carrera_tecnica: '',
        foto_carrera_tecnica: null,
      });
      toast.success('Carrera técnica agregada exitosamente');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al agregar carrera técnica: ${error.message}`);
      }
    }
  };

  const updateCarreraTecnica = async (id: number | null) => {
    if (id === null) return;
    try {
      const response = await fetch(`${apiUrl}carreras/tecnicas/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCarrera),
      });

      if (!response.ok) {
        toast.error('Network response was not ok');
        return;
      }
      fetchCarreras();
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentId(null);
      setNewCarrera({
        nombre_carrera_tecnica: '',
        descripcion_carrera_tecnica: '',
        foto_carrera_tecnica: null,
      });
      toast.success('Carrera técnica actualizada exitosamente');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al actualizar carrera técnica: ${error.message}`);
      }
    }
  };

  const deleteCarreraTecnica = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}carreras/tecnicas/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Network response was not ok');
        return;
      }
      fetchCarreras();
      toast.success('Carrera técnica eliminada exitosamente');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al eliminar carrera técnica: ${error.message}`);
      }
      
    }
  };

  const openEditModal = (carrera: CarreraTecnica) => {
    setNewCarrera({
      nombre_carrera_tecnica: carrera.nombre_carrera_tecnica,
      descripcion_carrera_tecnica: carrera.descripcion_carrera_tecnica,
      foto_carrera_tecnica: carrera.foto_carrera_tecnica,
    });
    setCurrentId(carrera.id_carrera_tecnica);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = carreras.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(carreras.length / itemsPerPage); i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`page-button ${currentPage === i ? 'active' : ''}`}>
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="carreras-tecnicas-admin-container ">
      <ToastContainer />
      <button className="add-button-carreras-tecnicas-admin" onClick={() => {
        setIsEditing(false);
        setIsModalOpen(true);
      }}>Agregar Carrera Técnica</button>
      <table className="carreras-tecnicas-admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((carrera) => (
            <tr key={carrera.id_carrera_tecnica}>
              <td>{carrera.nombre_carrera_tecnica}</td>
              <td>{carrera.descripcion_carrera_tecnica}</td>
              <td>
                {carrera.foto_carrera_tecnica && (
                  <img
                    src={`data:image/png;base64,${carrera.foto_carrera_tecnica}`}
                    alt={carrera.nombre_carrera_tecnica}
                    className="carreras-tecnicas-admin-imagen"
                  />
                )}
              </td>
              <td>
                <button className="edit-button-carreras-tecnicas-admin" onClick={() => openEditModal(carrera)}>Editar</button>
                <button className="delete-button-carreras-tecnicas-admin" onClick={() => deleteCarreraTecnica(carrera.id_carrera_tecnica)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-carreras-tecnicas-admin">
        {renderPageNumbers()}
      </div>

      {isModalOpen && (
        <div className="register-modal-overlay-carreras-tecnicas-admin">
          <div className="register-modal-content-carreras-tecnicas-admin">
            <form className='form-group-carreras-tecnicas-admin' onSubmit={(e: FormEvent) => {
              e.preventDefault();

              if (isEditing && currentId) {
                updateCarreraTecnica(currentId);
              } else {
                addCarreraTecnica();
              }
              
            }}>
              <h3>{isEditing ? 'Editar' : 'Agregar'} Carrera Técnica</h3>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_carrera_tecnica"
                  value={newCarrera.nombre_carrera_tecnica}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="descripcion_carrera_tecnica"
                  value={newCarrera.descripcion_carrera_tecnica}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </label>
              <label>
                Foto:
                <input
                  type="file"
                  name="foto_carrera_tecnica"
                  onChange={handleImageChange}
                  required={!isEditing}
                />
              </label>
              <button type="submit" className="save-button-carreras-tecnicas-admin">{isEditing ? 'Actualizar' : 'Agregar'}</button>
              <span className="cancel-button-carreras-tecnicas-admin" onClick={() => setIsModalOpen(false)}>&times;</span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
