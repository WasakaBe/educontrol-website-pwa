import React, { useState, useEffect } from 'react';
import { apiUrl } from "../../../constants/Api";

import './Welcome.css';
import { getOfflineData, saveDataOffline } from '../../../db';

interface WelcomeData {
  id_welcome: number;
  welcome_text: string;
  foto_welcome: string | null;
}

interface MisionVisionData {
  id_mision?: number;
  id_vision?: number;
  mision_text?: string;
  vision_text?: string;
}

const Welcome: React.FC = () => {
  const [welcomes, setWelcomes] = useState<WelcomeData[]>([]);
  const [mision, setMision] = useState<MisionVisionData | null>(null);
  const [vision, setVision] = useState<MisionVisionData | null>(null);
  const [showMisionModal, setShowMisionModal] = useState(false);
  const [showVisionModal, setShowVisionModal] = useState(false);

  useEffect(() => {
    fetchWelcomeData();
  }, []);

  const fetchWelcomeData = async () => {
    try {
      const response = await fetch(`${apiUrl}welcome`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: WelcomeData[] = await response.json();
      setWelcomes(data);
    } catch (error) {
      console.error('Error fetching welcome data:', error);
    }
  };

  const fetchMisionData = async () => {
    try {
      const response = await fetch(`${apiUrl}mision`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: MisionVisionData[] = await response.json();
      setMision(data[0]);

      // Almacenar los datos en IndexedDB para su uso offline
      saveDataOffline({
        value: JSON.stringify(data),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching mision data:', error);

      // Intentar recuperar los datos desde IndexedDB
      const offlineData = await getOfflineData();
      if (offlineData.length > 0) {
        const cachedMision = JSON.parse(offlineData[0].value);
        setMision(cachedMision[0]);
        console.log('Datos recuperados de IndexedDB:', cachedMision);
      }
    }
  };

  const fetchVisionData = async () => {
    try {
      const response = await fetch(`${apiUrl}vision`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: MisionVisionData[] = await response.json();
      setVision(data[0]);

      // Almacenar los datos en IndexedDB para su uso offline
      saveDataOffline({
        value: JSON.stringify(data),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching vision data:', error);

      // Intentar recuperar los datos desde IndexedDB
      const offlineData = await getOfflineData();
      if (offlineData.length > 0) {
        const cachedVision = JSON.parse(offlineData[0].value);
        setVision(cachedVision[0]);
        console.log('Datos recuperados de IndexedDB:', cachedVision);
      }
    }
  };

  const handleMisionClick = () => {
    fetchMisionData();
    setShowMisionModal(true);
  };

  const handleVisionClick = () => {
    fetchVisionData();
    setShowVisionModal(true);
  };

  return (
    <div className="welcome-container">
      {welcomes.length > 0 ? (
        welcomes.map((welcome) => (
          <div key={welcome.id_welcome} className="welcome-item">
            <div className="welcome-image">
              {welcome.foto_welcome ? (
                <img src={`data:image/jpeg;base64,${welcome.foto_welcome}`} alt="Welcome" />
              ) : (
                <span>No image available</span>
              )}
            </div>
            <div className="welcome-text">
              <h1>Bienvenidos!</h1>
              <p>{welcome.welcome_text}</p>
              <div className='buttons'>
                <button className='btn-view' onClick={handleMisionClick}>Misión</button>
                <button className='btn-view' onClick={handleVisionClick}>Visión</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}

      {showMisionModal && mision && (
        <div className="modal-mision">
          <div className="modal-content-mision">
            <span className="close-button" onClick={() => setShowMisionModal(false)}>&times;</span>
            <h2>Misión</h2>
            <p>{mision.mision_text}</p>
          </div>
        </div>
      )}

      {showVisionModal && vision && (
        <div className="modal-mision">
          <div className="modal-content-mision">
            <span className="close-button" onClick={() => setShowVisionModal(false)}>&times;</span>
            <h2>Visión</h2>
            <p>{vision.vision_text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
