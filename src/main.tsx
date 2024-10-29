import React, { useState, useEffect } from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import SplashScreen from './SplashScreen';
import './index.css';
import { apiUrl } from './constants/Api.tsx';
import { toast } from 'react-toastify'; // Importa el toast
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de incluir los estilos de Toastify

// Registrar el Service Worker para la PWA
//import { registerSW } from 'virtual:pwa-register';

//registerSW({
//  onNeedRefresh() {
   // toast('Nueva versión disponible. Actualiza la aplicación.');
 // },
 // onOfflineReady() {
   // toast('La aplicación está lista para trabajar sin conexión.');
 // }
//});

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    // Timer para el SplashScreen
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsAppLoaded(true);
    }, 1000); // Mostrar el SplashScreen por 1 segundo
    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, []);

  useEffect(() => {
    if (isAppLoaded) {
      // Registrar el Service Worker y suscribir al usuario al servicio Push
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registrado con éxito.');
            // Solicitar permisos de notificaciones después de que el SW esté registrado
            requestNotificationPermission().then((permission) => {
              if (permission === 'granted') {
                // Si el permiso se concede, se suscribe al usuario al servicio Push
                subscribeUserToPush(registration);
              }
            });
          })
          .catch(() => {
            console.log('Error al registrar el Service Worker.');
          });
      }
    }
  }, [isAppLoaded]); // Solo se ejecuta cuando la aplicación está cargada

  // Función para solicitar permisos de notificación
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Permiso para notificaciones concedido.');
    } else if (permission === 'denied') {
      toast.error('Permiso para notificaciones denegado.');
      toast('Favor de otorgar permisos para este sitio.');
    } else {
      toast.info('Permiso de notificación no se otorgó explícitamente (estado default).');
    }
    return permission;
  };

  // Función para suscribir al usuario al servicio Push
  const subscribeUserToPush = async (registration: ServiceWorkerRegistration) => {
    const publicVapidKey = 'BJEI6FtirsSkzlN0C1TwPOkyvQG9ptkeqHjlroSZndODByYHOQuRH37lDdWfAJn9yPlsQ7B3OjqEKHu7SxIZ1Bw'; // Reemplaza con tu clave pública VAPID

    // Convierte la clave VAPID a Uint8Array
    const urlBase64ToUint8Array = (base64String: string) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      toast.success('Suscripción exitosa.');

      // Aquí podrías enviar la suscripción a tu backend para almacenarla y poder usarla luego.
      // Ejemplo:
      await fetch(`${apiUrl}subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch  {
      toast.error('Error al suscribir al usuario.');
    }
  };

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
