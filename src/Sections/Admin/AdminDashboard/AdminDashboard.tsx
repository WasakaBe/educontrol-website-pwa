import './AdminDashboard.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiUrl } from '../../../constants/Api';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { saveDataOffline, getOfflineData } from '../../../db'; // IndexedDB functions

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
  motivo_feedback: string;
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
        const response = await fetch(`${apiUrl}/view/feedbacks`);
        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);

          // Guardar los datos en IndexedDB para acceso offline
          await saveDataOffline({
            key: 'feedbackData',
            value: JSON.stringify(data),
            timestamp: Date.now(),
          });
        } else {
          console.error('Error fetching feedbacks');
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);

        // Intentar cargar los datos de IndexedDB en modo offline
        const offlineData = await getOfflineData('feedbackData');
        if (offlineData) {
          const cachedFeedbacks = JSON.parse(offlineData.value);
          setFeedbacks(cachedFeedbacks);
          console.info('Cargando datos de feedback desde IndexedDB');
        }
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

  const barChartData = {
    labels: Object.keys(emotionCounts),
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
        <h2>Dashboard Administrador</h2>
        <p>{formattedTime}</p>
      </div>
      <div className="admin-welcome">
        <p>
          Bienvenido, <span>{user2}</span>
        </p>
        <p>Es un gusto tenerte con nosotros. ¡Ánimo!</p>
      </div>
      <div className="admin-feedbacks">
        <h3>Distribución de Feedbacks por Emoción</h3>
        {Object.keys(emotionCounts).length === 0 ? (
          <p>No hay feedbacks disponibles.</p>
        ) : (
          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
