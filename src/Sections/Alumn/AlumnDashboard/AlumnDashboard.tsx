import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { saveDataOffline, getOfflineData } from '../../../db';

interface LocationState {
  user2?: string;
}

const AlumnDashboard: React.FC = () => {
  const location = useLocation();
  const { user2 } = (location.state as LocationState) || {};
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [cachedUser, setCachedUser] = useState<string | null>(null);
  const [cachedTime, setCachedTime] = useState<string | null>(null);

  useEffect(() => {
    // Guardar el nombre de usuario y el tiempo actual en IndexedDB
    if (user2) {
      saveDataOffline({
        key: 'alumnDashboardData',
        value: JSON.stringify({ user2, time: new Date().toISOString() }),
        timestamp: Date.now(),
      });
    }

    // Intentar cargar datos desde IndexedDB en caso de falta de conexión o primer render
    const loadCachedData = async () => {
      const cachedData = await getOfflineData('alumnDashboardData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData.value);
        setCachedUser(parsedData.user2);
        setCachedTime(new Date(parsedData.time).toLocaleString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }));
      }
    };

    loadCachedData();
  }, [user2]);

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

  return (
    <div className="admin-container-dashboard">
      <div className="admin-header">
        <h2>Dashboard Alumno</h2>
        <p>{formattedTime}</p>
        {cachedTime && (
          <p>Última sesión guardada: {cachedTime}</p>
        )}
      </div>
      <div className="admin-welcome">
        <p>Bienvenido, <span>{user2 || cachedUser}</span></p>
        <p>Es un gusto tenerte con nosotros. ¡Ánimo!</p>
      </div>
    </div>
  );
};

export default AlumnDashboard;
