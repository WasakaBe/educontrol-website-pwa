// src/firebaseConfig.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, getToken,onMessage  } from "firebase/messaging";
const VAPID_KEY = "BGzVgsHrD4pKaSPANqC6IEOpFTnaoTLKj7YPTJ8tRh0i2uWPakuumZt7o7Vb_oJdnTAyjEKl5yawQReEkVOZTOA"; 

const firebaseConfig = {
  apiKey: "AIzaSyCMnycziaIJUAGnpRPtFGJRMRUbquZtvR4",
  authDomain: "educontrol-fcd41.firebaseapp.com",
  projectId: "educontrol-fcd41",
  storageBucket: "educontrol-fcd41.firebasestorage.app",
  messagingSenderId: "457839507439",
  appId: "1:457839507439:web:86dfe11bea5e242a84e81a",
  measurementId: "G-YT6TRL9045"
};

// Inicializa Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);


// Función para solicitar el token de FCM
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      console.log("Token de FCM obtenido:", currentToken);
      return currentToken;
    } else {
      console.log("No se pudo obtener el token de FCM.");
    }
  } catch (error) {
    console.error("Error al obtener el token de FCM:", error);
  }
};

// Función para manejar mensajes en primer plano
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Mensaje recibido en primer plano: ", payload);
      resolve(payload);
    });
  });



export { app,  messaging };
