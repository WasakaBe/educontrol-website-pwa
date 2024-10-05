import React, { useState, useEffect } from 'react';
import './Cultural.css';
import { apiUrl } from '../../../constants/Api';

interface CulturalActivity {
  id_actividad_cultural: number;
  nombre_actividad_cultural: string;
  descripcion_actividad_cultural: string;
  imagen_actividad_cultural: string | null;
}

const Cultural: React.FC = () => {
  const [culturalActivities, setCulturalActivities] = useState<CulturalActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<CulturalActivity | null>(null);

  useEffect(() => {
    fetchCulturalActivities();
  }, []);

  const fetchCulturalActivities = async () => {
    try {
      const response = await fetch(`${apiUrl}actividades_culturales`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: CulturalActivity[] = await response.json();
      setCulturalActivities(data);
    } catch (error) {
      console.error('Error fetching cultural activities:', error);
    }
  };

  const handleImageClick = (activity: CulturalActivity) => {
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="cultural-container">
      <h1 className="cultural-title">Actividades Culturales</h1>
      {culturalActivities.length > 0 ? (
        <div className="cultural-grid">
          {culturalActivities.map((activity) => (
            <div key={activity.id_actividad_cultural} className="cultural-item" onClick={() => handleImageClick(activity)}>
              {activity.imagen_actividad_cultural ? (
                <img src={`data:image/jpeg;base64,${activity.imagen_actividad_cultural}`} alt={activity.nombre_actividad_cultural} />
              ) : (
                <span>No image available</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {selectedActivity && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedActivity.nombre_actividad_cultural}</h2>
            <p>{selectedActivity.descripcion_actividad_cultural}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cultural;
