import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Feedback.css';
import { apiUrl } from '../../../constants/Api'; // Ruta base de tu API
import { getOfflineData, saveDataOffline } from '../../../db'; // Importar las funciones de IndexedDB

interface FeedbackData {
  id_feedback: number;
  idusuario: number;
  nombre_usuario: string;
  correo_usuario: string;
  foto_usuario: string | null;
  emocion_feedback: string;
  motivo_feedback: string;
}

// Función para convertir la emoción en estrellas
const getStarsForEmotion = (emotion: string) => {
  switch (emotion) {
    case 'satisfecho':
      return 5;
    case 'medio satisfecho':
      return 4;
    case 'bien':
      return 3;
    case 'mal':
      return 2;
    case 'peor':
      return 1;
    default:
      return 0;
  }
};

const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${apiUrl}/view/feedbacks`);
      if (!response.ok) {
        throw new Error('Error al obtener los feedbacks');
      }
      const data: FeedbackData[] = await response.json();
      setFeedbacks(data);
      setLoading(false);

      // Guardar los datos de feedback en IndexedDB usando la clave "feedbackData"
      saveDataOffline({
        key: 'feedbackData',
        value: JSON.stringify(data),
        timestamp: Date.now(),
      });
    } catch (err: unknown) {
      console.error('Error al obtener feedbacks:', err);

      // Intentar cargar datos desde IndexedDB si no hay conexión
      const cachedData = await getOfflineData('feedbackData');
      if (cachedData) {
        setFeedbacks(JSON.parse(cachedData.value));
        setLoading(false);
        console.log('Datos cargados desde IndexedDB:', cachedData);
      } else {
        setError('No se pudieron cargar los datos de feedback ni desde la red ni desde IndexedDB.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <div>Cargando feedbacks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const settings = {
    dots: true,
    infinite: true, // Carrusel infinito
    speed: 500,
    slidesToShow: 3, // Mostrar 3 slides por vez
    slidesToScroll: 1, // Desplazar 1 slide a la vez
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">Opiniones de los usuarios</h1>
      <Slider {...settings}>
        {feedbacks.map((feedback) => (
          <div key={feedback.id_feedback} className="feedback-slide">
            <div className="feedback-card">
              <div className="feedback-header">
                <img
                  src={feedback.foto_usuario ? `data:image/png;base64,${feedback.foto_usuario}` : '/default-avatar.png'}
                  alt={feedback.nombre_usuario}
                  className="feedback-avatar"
                />
                <div className="feedback-user-info">
                  <h3>{feedback.nombre_usuario}</h3>
                  <p>{feedback.correo_usuario}</p>
                </div>
              </div>
              <div className="feedback-body">
                <p><strong>Emoción:</strong></p>
                <div className="feedback-stars">
                  {/* Mostrar estrellas según la emoción */}
                  {Array.from({ length: getStarsForEmotion(feedback.emocion_feedback) }).map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} color="#ffc107" />
                  ))}
                </div>
                <p><strong>Motivo:</strong> {feedback.motivo_feedback}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Feedback;
