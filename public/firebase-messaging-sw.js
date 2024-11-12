// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js");


const firebaseConfig = {
  apiKey: "AIzaSyCMnycziaIJUAGnpRPtFGJRMRUbquZtvR4",
  authDomain: "educontrol-fcd41.firebaseapp.com",
  projectId: "educontrol-fcd41",
  storageBucket: "educontrol-fcd41.firebasestorage.app",
  messagingSenderId: "457839507439",
  appId: "1:457839507439:web:86dfe11bea5e242a84e81a",
  measurementId: "G-YT6TRL9045"
};


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: ""
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
