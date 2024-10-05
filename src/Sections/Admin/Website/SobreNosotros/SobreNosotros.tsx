import { useState, useEffect, ChangeEvent } from 'react';
import { apiUrl } from '../../../../constants/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SobreNosotros.css'
// Definir la interfaz para los datos de "Sobre Nosotros"
interface SobreNosotros {
  id_sobre_nosotros: number;
  txt_sobre_nosotros: string;
  imagen_sobre_nosotros: string | null;
  fecha_sobre_nosotros: string;
}

// Definir la interfaz para el formulario de "Sobre Nosotros"
interface SobreNosotrosForm {
  txt_sobre_nosotros: string;
  imagen_sobre_nosotros: File | null;
  fecha_sobre_nosotros: string;
}

export default function SobreNosotros() {
  const [sobreNosotros, setSobreNosotros] = useState<SobreNosotros[]>([]);
  const [newItem, setNewItem] = useState<SobreNosotrosForm>({
    txt_sobre_nosotros: '',
    imagen_sobre_nosotros: null,
    fecha_sobre_nosotros: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    fetchSobreNosotros();
  }, []);

  const fetchSobreNosotros = async () => {
    try {
      const response = await fetch(`${apiUrl}sobre_nosotros`);
      const data = await response.json();
      setSobreNosotros(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error fetching sobre nosotros: ${error.message}`);
      } else {
        toast.error('Error fetching sobre nosotros');
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewItem((prev) => ({
      ...prev,
      imagen_sobre_nosotros: file,
    }));
  };

  const addSobreNosotros = async () => {
    try {
      const formData = new FormData();
      formData.append('txt_sobre_nosotros', newItem.txt_sobre_nosotros);
      if (newItem.imagen_sobre_nosotros) {
        formData.append('imagen_sobre_nosotros', newItem.imagen_sobre_nosotros);
      }
      formData.append('fecha_sobre_nosotros', newItem.fecha_sobre_nosotros);

      const response = await fetch(`${apiUrl}sobre_nosotros/insert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchSobreNosotros();
      setIsModalOpen(false);
      setNewItem({
        txt_sobre_nosotros: '',
        imagen_sobre_nosotros: null,
        fecha_sobre_nosotros: '',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error adding sobre nosotros: ${error.message}`);
      } else {
        toast.error('Error adding sobre nosotros');
      }
    }
  };

  const updateSobreNosotros = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append('txt_sobre_nosotros', newItem.txt_sobre_nosotros);
      if (newItem.imagen_sobre_nosotros) {
        formData.append('imagen_sobre_nosotros', newItem.imagen_sobre_nosotros);
      }
      formData.append('fecha_sobre_nosotros', newItem.fecha_sobre_nosotros);

      const response = await fetch(`${apiUrl}sobre_nosotros/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchSobreNosotros();
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentId(null);
      setNewItem({
        txt_sobre_nosotros: '',
        imagen_sobre_nosotros: null,
        fecha_sobre_nosotros: '',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating sobre nosotros: ${error.message}`);
      } else {
        toast.error('Error updating sobre nosotros');
      }
    }
  };

  const deleteSobreNosotros = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}sobre_nosotros/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchSobreNosotros();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting sobre nosotros: ${error.message}`);
      } else {
        toast.error('Error deleting sobre nosotros');
      }
    }
  };

  const openEditModal = (item: SobreNosotros) => {
    setNewItem({
      txt_sobre_nosotros: item.txt_sobre_nosotros,
      imagen_sobre_nosotros: null,
      fecha_sobre_nosotros: item.fecha_sobre_nosotros,
    });
    setCurrentId(item.id_sobre_nosotros);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="sobre-nosotros-admin-container">
      <ToastContainer />
      <button className="add-button-sobre-nosotros-admin" onClick={() => {
        setIsEditing(false);
        setIsModalOpen(true);
      }}>Agregar Sobre Nosotros</button>
      <table className="sobre-nosotros-admin-table">
        <thead>
          <tr>
            <th>Texto</th>
            <th>Imagen</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sobreNosotros.map((item) => (
            <tr key={item.id_sobre_nosotros}>
              <td>{item.txt_sobre_nosotros}</td>
              <td>
                {item.imagen_sobre_nosotros && (
                  <img
                    src={`data:image/png;base64,${item.imagen_sobre_nosotros}`}
                    alt="Sobre Nosotros"
                    className="sobre-nosotros-admin-imagen "
                  />
                )}
              </td>
              <td>{new Date(item.fecha_sobre_nosotros).toLocaleDateString()}</td>
              <td>
                <button className="edit-button-sobre-nosotros-admin" onClick={() => openEditModal(item)}>Editar</button>
                <button className="delete-button-sobre-nosotros-admin" onClick={() => deleteSobreNosotros(item.id_sobre_nosotros)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="register-modal-overlay-sobre-nosotros-admin">
          <div className="register-modal-content-sobre-nosotros-admin">
            <form className='form-group-sobre-nosotros-admin' onSubmit={(e) => {
              e.preventDefault();
              if (isEditing && currentId !== null) {
                updateSobreNosotros(currentId);
              } else {
                addSobreNosotros();
              }
            }}>
              <h3>{isEditing ? 'Editar' : 'Agregar'} Sobre Nosotros</h3>
              <label>
                Texto:
                <textarea
                  name="txt_sobre_nosotros"
                  value={newItem.txt_sobre_nosotros}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Imagen:
                <input
                  type="file"
                  name="imagen_sobre_nosotros"
                  onChange={handleImageChange}
                  required={!isEditing}
                />
              </label>
              <label>
                Fecha:
                <input
                  type="datetime-local"
                  name="fecha_sobre_nosotros"
                  value={newItem.fecha_sobre_nosotros}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit" className="save-button-sobre-nosotros-admin">{isEditing ? 'Actualizar' : 'Agregar'}</button>
              <span className="cancel-button-sobre-nosotros-admin" onClick={() => setIsModalOpen(false)}>&times;</span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
