import React, { useEffect } from 'react';
import AppRoutes from "./Routes/AppRoutes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fantasma_faild, fantasma_success } from './assets/icons';
const App: React.FC = () => {
  useEffect(() => {
    // Configurar el evento para deshabilitar el scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollSpeed = 200;
      window.scrollBy({
        top: e.deltaY > 0 ? scrollSpeed : -scrollSpeed,
        left: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Detectar si el usuario está offline y mostrar una notificación
  useEffect(() => {
    const handleOffline = () => {
      toast.error(
        <div className="custom-toast">
          <img src={fantasma_faild} alt="offline" className="toast-icon" />
          <div className="toast-content">
            <h3 className="toast-title">Modo Offline :(</h3>
            <p className="toast-message">No tienes conexión a internet.</p>
          </div>
        </div>,
        {
          autoClose: 5000,
          className: 'custom-toast-container offline',
        }
      );
    };

    const handleOnline = () => {
      toast.success(
        <div className="custom-toast">
          <img src={fantasma_success} alt="online" className="toast-icon" />
          <div className="toast-content">
            <h3 className="toast-title">De vuelta Online :)</h3>
            <p className="toast-message">Conexión restaurada con éxito.</p>
          </div>
        </div>,
        {
          autoClose: 5000,
          className: 'custom-toast-container online',
        }
      );
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);


  return (
    <div>
      <AppRoutes />
      <ToastContainer />
    </div>
  );
};

export default App;
