import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface LocationState {
  user2?: string;
}

const AlumnDashboard: React.FC = () => {
  const location = useLocation();
  const { user2 } = (location.state as LocationState) || {};
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

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
    <div className='admin-container-dashboard'>
      <div className='admin-header'>
        <h2>Dashboard Alumno</h2>
        <p>{formattedTime}</p>
      </div>
      <div className='admin-welcome'>
        <p>Bienvenido, <span>{user2}</span></p>
        <p>es un gusto tenerte con nosotros. ¡Ánimo!</p>
      </div>
    </div>
  );
};

export default AlumnDashboard;
