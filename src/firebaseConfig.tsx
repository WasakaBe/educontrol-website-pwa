// src/firebaseConfig.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, getToken } from "firebase/messaging";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCMnycziaIJUAGnpRPtFGJRMRUbquZtvR4",
  authDomain: "educontrol-fcd41.firebaseapp.com",
  projectId: "educontrol-fcd41",
  storageBucket: "educontrol-fcd41.firebasestorage.app",
  messagingSenderId: "457839507439",
  appId: "1:457839507439:web:86dfe11bea5e242a84e81a",
  measurementId: "G-YT6TRL9045",
};

// Inicializa Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics | null = typeof window !== "undefined" ? getAnalytics(app) : null;
const messaging: Messaging = getMessaging(app);

export { app, analytics, messaging, getToken };
