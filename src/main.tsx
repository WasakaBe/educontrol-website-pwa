import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import SplashScreen from './SplashScreen';
import './index.css';
// Registrar el Service Worker para la PWA
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    console.log('Nueva versión disponible. Actualiza la aplicación.');
  },
  onOfflineReady() {
    console.log('La aplicación está lista para trabajar sin conexión.');
  }
});

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 9000); // Mostrar el SplashScreen por 9 segundos
    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, []);

  return (
    <>
      {showSplash ? <SplashScreen /> : <App />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
