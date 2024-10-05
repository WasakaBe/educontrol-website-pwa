import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../constants/Api';
import './Inscription.css';

interface InscriptionData {
  txt_info_inscription: string;
  requeriments_info_inscription: string;
  periodo_info_inscripcion: string;
  imagen_info_inscription: string;
}

const Inscription: React.FC = () => {
  const [inscriptionData, setInscriptionData] = useState<InscriptionData | null>(null);
  const navigate = useNavigate();

  const BtnInscripcion = () => {
    navigate('/Formulario/Inscription');
  };

  useEffect(() => {
    const fetchInscriptionData = async () => {
      try {
        const response = await fetch(`${apiUrl}info_inscription`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.length > 0) {
          setInscriptionData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching inscription data:', error);
      }
    };

    fetchInscriptionData();
  }, []);

  if (!inscriptionData) {
    return <div>Loading...</div>;
  }

  const renderRequeriments = () => {
    return inscriptionData.requeriments_info_inscription
      .split('\n')
      .map((req, index) => <li key={index}>{req}</li>);
  };

  return (
    <div className="inscription-container" id='Inscripcion'>
      <div className="inscription-text">
        <h1>REQUISITOS PARA LA INSCRIPCIÓN</h1>
        <p>{inscriptionData.txt_info_inscription}</p>
        <ul>{renderRequeriments()}</ul>
        <h1>Periodo:</h1>
        <p>{inscriptionData.periodo_info_inscripcion}</p>
        <button onClick={BtnInscripcion} className="btn-view">
          Ver más →
        </button>
      </div>
      <div className="inscription-image">
        <img src={`data:image/png;base64,${inscriptionData.imagen_info_inscription}`} alt="Welcome" />
      </div>
    </div>
  );
};

export default Inscription;
