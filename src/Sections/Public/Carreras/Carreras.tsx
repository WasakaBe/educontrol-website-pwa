import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../constants/Api';
import './Carreras.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CarreraTecnica {
  id_carrera_tecnica: number;
  nombre_carrera_tecnica: string;
  descripcion_carrera_tecnica: string;
  foto_carrera_tecnica: string | null;
}

const Carreras: React.FC = () => {
  const [carreras, setCarreras] = useState<CarreraTecnica[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraTecnica | null>(null);

  useEffect(() => {
    fetchCarrerasTecnicas();
  }, []);

  const fetchCarrerasTecnicas = async () => {
    try {
      const response = await fetch(`${apiUrl}carreras/tecnicas`);
      const data = await response.json();
      if (data.carreras) {
        setCarreras(data.carreras);
      } else {
        toast.error('No se encontraron carreras técnicas');
      }
    } catch {
      toast.error('Error al cargar carreras técnicas');
    }
  };

  const handleImageClick = (carrera: CarreraTecnica) => {
    setSelectedCarrera(carrera);
  };

  const closeModal = () => {
    setSelectedCarrera(null);
  };

  return (
    <div className="carreras-container">
      <h1 className="titulo-centrado">Carreras Técnicas</h1>
      <div className="carreras-list">
        {carreras.length > 0 ? (
          carreras.map((carrera) => (
            <div
              key={carrera.id_carrera_tecnica}
              className="carrera-card"
              onClick={() => handleImageClick(carrera)}
            >
              {carrera.foto_carrera_tecnica && (
                <img
                  src={`data:image/png;base64,${carrera.foto_carrera_tecnica}`}
                  alt={carrera.nombre_carrera_tecnica}
                  className="carrera-imagen"
                />
              )}
            </div>
          ))
        ) : (
          <p>No hay carreras técnicas disponibles en este momento.</p>
        )}
      </div>

      {selectedCarrera && (
        <div className="modal-carreras" onClick={closeModal}>
          <div className="modal-content-carreras" onClick={(e) => e.stopPropagation()}>
            <span className="close-button-carreras" onClick={closeModal}>&times;</span>
            <h2>{selectedCarrera.nombre_carrera_tecnica}</h2>
            <p>{selectedCarrera.descripcion_carrera_tecnica}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carreras;
