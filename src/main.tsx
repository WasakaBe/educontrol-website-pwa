//sentry es monitoreo de software
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "https://cce2df658b1444eb3b430b42c42e31e4@o4508286180196352.ingest.us.sentry.io/4508286183079936",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  release: "eb4d6b0405eedf5c25f58e6d4b0933185fb2d3bb@0.1.0",
});


import React, { useState, useEffect, useContext } from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import SplashScreen from './SplashScreen';
import './index.css';
import { apiUrl } from './constants/Api.tsx';
import { toast } from 'react-toastify'; // Importa el toast
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de incluir los estilos de Toastify
import { AuthContext } from './Auto/Auth';  // Importa el contexto de autenticación
import { onCLS, onFID, onLCP , Metric} from 'web-vitals';

// Función para enviar las métricas a Sentry y consola// Función para enviar las métricas a Sentry y consola
// Función para enviar las métricas a Sentry y consola
function sendToAnalytics(metric: Metric) {
  console.log(metric);
  
  // Simplificar el objeto metric para enviarlo a Sentry
  const simplifiedMetric = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
  };

  Sentry.captureMessage(`Web Vital Metric: ${metric.name}`, {
    level: 'info',
    extra: simplifiedMetric,
  });

  // Puedes enviar estos datos a una API, por ejemplo:
  // fetch('/analytics', { method: 'POST', body: JSON.stringify(metric) });
}

// Utilizando las métricas
onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);




// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const authContext = useContext(AuthContext);  // Obtiene el contexto de autenticación

  useEffect(() => {
    // Timer para el SplashScreen
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsAppLoaded(true);
    }, 1000); // Mostrar el SplashScreen por 1 segundo
    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, []);

  useEffect(() => {
    if (isAppLoaded && authContext?.user) {
      const subscribeUserToPush = async (registration: ServiceWorkerRegistration, email: string) => {
        const publicVapidKey = 'BGzVgsHrD4pKaSPANqC6IEOpFTnaoTLKj7YPTJ8tRh0i2uWPakuumZt7o7Vb_oJdnTAyjEKl5yawQReEkVOZTOA';

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

          const keys = {
            p256dh: subscription.getKey('p256dh') ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('p256dh')!)))) : null,
            auth: subscription.getKey('auth') ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('auth')!)))) : null,
          };

          const response = await fetch(`${apiUrl}subscribe`, {
            method: 'POST',
            body: JSON.stringify({
              endpoint: subscription.endpoint,
              keys: keys,
              email: email,  // Enviando el email del usuario
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const result = await response.json();
          if (response.ok) {
            toast.success(result.message || 'Suscripción almacenada con éxito');
            sendNotificationToUser(email);
          } else {
            toast.error(result.error || 'Error al almacenar la suscripción.');
          }
        } catch (error) {
          console.error('Error al suscribir al usuario:', error);
          toast.error('Error al suscribir al usuario.');
        }
      };

      // Registrar el Service Worker y suscribir al usuario al servicio Push
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service Worker registrado con éxito.');
            // Solicitar permisos de notificaciones después de que el SW esté registrado
            requestNotificationPermission().then((permission) => {
              if (permission === 'granted' && authContext.user?.correo_usuario) {
                // Si el permiso se concede, se suscribe al usuario al servicio Push
                subscribeUserToPush(registration, authContext.user.correo_usuario);
              }
            });
          })
          .catch(() => {
            console.log('Error al registrar el Service Worker.');
          });
      }
    }
  }, [isAppLoaded, authContext]); // Solo se ejecuta cuando la aplicación está cargada y el contexto está disponible

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

  // Función para enviar una notificación al usuario después de la suscripción
  const sendNotificationToUser = async (email: string) => {
    try {
      const response = await fetch(`${apiUrl}notify`, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          message: "¡Gracias por suscribirte a nuestras notificaciones!",
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || 'Notificación enviada con éxito');
      } else {
        toast.error(result.error || 'Error al enviar la notificación.');
      }
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      toast.error('Error al enviar la notificación.');
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

