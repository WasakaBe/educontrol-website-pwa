import React, { useState, useEffect } from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import SplashScreen from './SplashScreen';
import './index.css';
import { apiUrl } from './constants/Api.tsx';
import { toast } from 'react-toastify'; // Importa el toast
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de incluir los estilos de Toastify


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
          .register('/firebase-messaging-sw.js')
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
// Función para suscribir al usuario al servicio Push
const subscribeUserToPush = async (registration: ServiceWorkerRegistration) => {
  const publicVapidKey = 'BGzVgsHrD4pKaSPANqC6IEOpFTnaoTLKj7YPTJ8tRh0i2uWPakuumZt7o7Vb_oJdnTAyjEKl5yawQReEkVOZTOA';

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

    // Extraer las claves p256dh y auth en formato base64
    const keys = {
      p256dh: subscription.getKey("p256dh") ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!))) : null,
      auth: subscription.getKey("auth") ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!))) : null
    };

    // Envía la suscripción al backend para almacenarla y manejar la respuesta
    const response = await fetch(`${apiUrl}subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: keys,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (response.ok) {
      toast.success(result.message || 'Suscripción almacenada con éxito');
    } else {
      console.error(result.error || 'Error al almacenar la suscripción.');
    }
  } catch (error) {
    console.error('Error al suscribir al usuario:', error);
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
