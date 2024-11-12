import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import SplashScreen from './SplashScreen';
import './index.css';
import { apiUrl } from './constants/Api.tsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    // Temporizador para el SplashScreen
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsAppLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAppLoaded) {
      // Registrar el Service Worker y suscribir al usuario al servicio Push
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js') // Registra el service worker correcto
          .then((registration) => {
            console.log('Service Worker registrado con éxito.');
            // Solicitar permisos de notificaciones
            requestNotificationPermission().then((permission) => {
              if (permission === 'granted') {
                // Suscribir al usuario al servicio Push
                subscribeUserToPush(registration);
              }
            });
          })
          .catch(() => {
            console.log('Error al registrar el Service Worker.');
          });
      }
    }
  }, [isAppLoaded]); // Ejecuta solo cuando la aplicación está cargada

  // Función para solicitar permisos de notificación
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Permiso para notificaciones concedido.');
    } else if (permission === 'denied') {
      toast.error('Permiso para notificaciones denegado.');
    } else {
      toast.info('Permiso de notificación no se otorgó explícitamente (estado default).');
    }
    return permission;
  };

  // Función para suscribir al usuario al servicio Push
  const subscribeUserToPush = async (registration: ServiceWorkerRegistration) => {
    const publicVapidKey = 'BJEI6FtirsSkzlN0C1TwPOkyvQG9ptkeqHjlroSZndODByYHOQuRH37lDdWfAJn9yPlsQ7B3OjqEKHu7SxIZ1Bw';

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

      // Envía la suscripción al backend para almacenarla y usarla luego
      await fetch(`${apiUrl}subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
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
