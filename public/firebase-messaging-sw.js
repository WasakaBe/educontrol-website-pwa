// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCMnycziaIJUAGnpRPtFGJRMRUbquZtvR4",
  authDomain: "educontrol.firebaseapp.com",
  projectId: "educontrol",
  storageBucket: "educontrol.appspot.com",
  messagingSenderId: "457839507439",
  appId: "1:457839507439:web:86dfe11bea5e242a84e81a",
  measurementId:"G-YT6TRL9045"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/public/logocbtapequeno.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
