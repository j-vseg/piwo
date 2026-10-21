importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD1XyDDSNJieMG7KjBtMuZfDIW6erp5Nuc",
  authDomain: "piwo-dev.firebaseapp.com",
  projectId: "piwo-dev",
  storageBucket: "piwo-dev.firebasestorage.app",
  messagingSenderId: "590621253653",
  appId: "1:590621253653:web:f458dc38e44b75a8676e1c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);
  self.registration.showNotification(payload.notification?.title, {
    body: payload.notification?.body,
  });
});
