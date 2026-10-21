importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js");

self.addEventListener("message", (event) => {
  if (event.data?.type !== "FIREBASE_CONFIG") return;

  firebase.initializeApp(event.data.config);

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Background message:", payload);
    self.registration.showNotification(payload.notification?.title, {
      body: payload.notification?.body,
    });
  });
});
