import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../../constants/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InfoBecas.css';
import { Beca } from '../../../../constants/interfaces';
const InfoBecas: React.FC = () => {
  const [becas, setBecas] = useState<Beca[]>([]);
  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [requisitos, setRequisitos] = useState<string>('');
  const [foto, setFoto] = useState<File | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentBecaId, setCurrentBecaId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}info_becas`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBecas(data);
        } else {
          toast.error('Error fetching data: Data is not an array');
        }
      })
      .catch(error => toast.error('Error fetching data:', error));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
    }
  };

  const handleCreateBeca = () => {
    if (!titulo || !descripcion || !requisitos || !foto) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('titulo_info_becas', titulo);
    formData.append('descripcion_info_becas', descripcion);
    formData.append('requisitos_info_becas', requisitos);
    formData.append('foto_info_becas', foto);

    fetch(`${apiUrl}info_becas/insert`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Información de beca creada exitosamente');
          setBecas([...becas, data]);
          setIsCreateModalOpen(false);
          // Clear form fields
          setTitulo('');
          setDescripcion('');
          setRequisitos('');
          setFoto(null);
        }
      })
      .catch(error => toast.error('Error creating data:', error));
  };

  const handleUpdateBeca = () => {
    if (currentBecaId === null) return;

    const formData = new FormData();
    formData.append('titulo_info_becas', titulo);
    formData.append('descripcion_info_becas', descripcion);
    formData.append('requisitos_info_becas', requisitos);
    if (foto) {
      formData.append('foto_info_becas', foto);
    }

    fetch(`${apiUrl}info_becas/update/${currentBecaId}`, {
      method: 'PUT',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Información de beca actualizada exitosamente');
          setBecas(becas.map(beca => (beca.id_info_becas === currentBecaId ? data : beca)));
          setIsUpdateModalOpen(false);
          // Clear form fields
          setTitulo('');
          setDescripcion('');
          setRequisitos('');
          setFoto(null);
          setCurrentBecaId(null);
        }
      })
      .catch(error => toast.error('Error updating data:', error));
  };

  const openUpdateModal = (beca: Beca) => {
    setTitulo(beca.titulo_info_becas);
    setDescripcion(beca.descripcion_info_becas);
    setRequisitos(beca.requisitos_info_becas);
    setFoto(null);
    setCurrentBecaId(beca.id_info_becas);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteBeca = (id: number) => {
    fetch(`${apiUrl}info_becas/delete/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Información de beca eliminada exitosamente');
          setBecas(becas.filter(beca => beca.id_info_becas !== id));
        }
      })
      .catch(error => toast.error('Error deleting data:', error));
  };

  return (
    <div className="info-becas-container">
      <h2>Información de Becas</h2>
      <button className="add-button" onClick={() => setIsCreateModalOpen(true)}>Agregar Información</button>
      <table className="becas-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Requisitos</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {becas.length > 0 ? (
            becas.map(beca => (
              <tr key={beca.id_info_becas}>
                <td>{beca.titulo_info_becas}</td>
                <td>{beca.descripcion_info_becas}</td>
                <td>{beca.requisitos_info_becas}</td>
                <td>
                  {beca.foto_info_becas && <img  className="info-alumn-admin-imagen" src={`data:image/jpeg;base64,${beca.foto_info_becas}`} alt="Foto de Beca" />}
                </td>
                <td>
                  <button className="update-button" onClick={() => openUpdateModal(beca)}>Actualizar</button>
                  <button className="delete-button" onClick={() => handleDeleteBeca(beca.id_info_becas)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-records">No hay registros</td>
            </tr>
          )}
        </tbody>
      </table>

      {isCreateModalOpen && (
        <div className="modal-overlay-becas">
          <div className="modal-becas">
            <h2>Agregar Información de Beca</h2>
            <div className="form-becas">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <textarea
                placeholder="Requisitos"
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
              />
              <input
                type="file"
                onChange={handleImageChange}
              />
              <button onClick={handleCreateBeca}>Crear Beca</button>
              <button className="close-button-becas" onClick={() => setIsCreateModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="modal-overlay-becas">
          <div className="modal-becas">
            <h2>Actualizar Información de Beca</h2>
            <div className="form-becas">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <textarea
                placeholder="Requisitos"
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
              />
              <input
                type="file"
                onChange={handleImageChange}
              />
              <button onClick={handleUpdateBeca}>Actualizar Beca</button>
              <button className="close-button-becas" onClick={() => setIsUpdateModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default InfoBecas;
