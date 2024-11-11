import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../constants/Api';
import './Inscription.css';
import { getOfflineData, saveDataOffline } from '../../../db';

interface InscriptionData {
  txt_info_inscription: string;
  requeriments_info_inscription: string;
  periodo_info_inscripcion: string;
  imagen_info_inscription: string;
}

const Inscription: React.FC = () => {
  const [inscriptionData, setInscriptionData] = useState<InscriptionData | null>(null);



  useEffect(() => {
    fetchInscriptionData();
  }, []);

  const fetchInscriptionData = async () => {
    try {
      const response = await fetch(`${apiUrl}info_inscription`);
      if (!response.ok) {
        console.error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length > 0) {
        setInscriptionData(data[0]);

        // Guardar los datos en IndexedDB usando la clave "inscriptionData"
        saveDataOffline({ key: 'inscriptionData', value: JSON.stringify(data[0]), timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Error fetching inscription data:', error);

      // Intentar cargar datos desde IndexedDB si no hay conexión
      const cachedData = await getOfflineData('inscriptionData');
      if (cachedData) {
        setInscriptionData(JSON.parse(cachedData.value));
        console.log('Datos cargados desde IndexedDB:', cachedData);
      }
    }
  };

  if (!inscriptionData) {
    return <div>Loading...</div>;
  }

  const renderRequeriments = () => {
    return inscriptionData.requeriments_info_inscription
      .split('\n')
      .map((req, index) => <li key={index}>{req}</li>);
  };

  return (
    <div className="inscription-container" id="Inscripcion">
      <div className="inscription-text">
        <h1>REQUISITOS PARA LA INSCRIPCIÓN</h1>
        <p>{inscriptionData.txt_info_inscription}</p>
        <ul>{renderRequeriments()}</ul>
        <h1>Periodo:</h1>
        <p>{inscriptionData.periodo_info_inscripcion}</p>
   
      </div>
      <div className="inscription-image">
        <img src={`data:image/png;base64,${inscriptionData.imagen_info_inscription}`} alt="Inscription" />
      </div>
    </div>
  );
};

export default Inscription;
