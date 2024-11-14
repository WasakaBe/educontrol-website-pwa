import './AdminDashboard.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiUrl } from '../../../constants/Api';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LocationState {
  user2?: string;
}

interface Feedback {
  id_feedback: number;
  idusuario: number;
  nombre_usuario: string;
  correo_usuario: string;
  foto_usuario: string | null;
  emocion_feedback: string;
}

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { user2 } = state || {};
  const [currentTime, setCurrentTime] = useState(new Date());
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${apiUrl}view/feedbacks`);
        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        } else {
          console.error('Error fetching feedbacks');
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const emotionCounts = feedbacks.reduce((acc, feedback) => {
    acc[feedback.emocion_feedback] = (acc[feedback.emocion_feedback] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Definición de los emojis correspondientes a cada emoción
  const emotionLabelsWithEmojis: { [key: string]: string } = {
    'satisfecho': '😃',
    'medio satisfecho': '🙂',
    'bien': '😐',
    'mal': '🙁',
    'peor': '😡',
  };

  // Preparar las etiquetas con emojis para el gráfico
  const barChartData = {
    labels: Object.keys(emotionCounts).map((emotion) => emotionLabelsWithEmojis[emotion] || emotion),
    datasets: [
      {
        label: 'Cantidad de Feedbacks',
        data: Object.values(emotionCounts),
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
        ],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="admin-container-dashboard">
      <div className="admin-header">
        <h2>Panel de Control del Administrador</h2>
        <p>{formattedTime}</p>
      </div>
      <div className="admin-welcome">
        <p>
          Bienvenido, <span>{user2}</span>
        </p>
        <p>Es un gusto tenerte con nosotros. ¡Ánimo!</p>
      </div>
      <div className="admin-feedbacks">
        <h3>Análisis de Opiniones de los Usuarios sobre el Sitio Web</h3>
        <p>
          A continuación, se muestra un análisis detallado de los comentarios recibidos por parte de nuestros usuarios. Este análisis nos ayuda a comprender mejor sus experiencias y a identificar áreas clave de mejora para proporcionar un servicio de mayor calidad.
        </p>
      
        {Object.keys(emotionCounts).length === 0 ? (
          <p>No se han recibido comentarios de los usuarios hasta el momento.</p>
        ) : (
          <>
            <div className="chart-container">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="feedback-message">
            <span>Pregunta: </span>
              <p>
                Tu opinión es importante para nosotros. ¿Te resultó útil la información que consultaste?
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
