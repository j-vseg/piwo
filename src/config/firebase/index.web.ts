import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import {
  type Messaging,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  onRegistered,
  register,
} from "firebase/messaging";
import { getStorage } from "firebase/storage";

import { webSdkBaseConfig } from "./config";
import { accountsCollection, db, eventsCollection } from "./firestore";

const app = initializeApp({
  ...webSdkBaseConfig,
  appId: process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID,
});

const messagingReady: Promise<Messaging | null> = (async () => {
  const supported = await isSupported();
  if (!supported) return null;

  const messaging = getMessaging(app);

  onRegistered(messaging, (fid) => {
    console.log("FCM FID:", fid);
  });

  onMessage(messaging, (payload) => {
    console.log("FCM foreground message:", payload);
    new Notification(payload.notification?.title ?? "Notification", {
      body: payload.notification?.body,
    });
  });

  const swRegistration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  if (Notification.permission === "granted") {
    register(messaging, {
      vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
      serviceWorkerRegistration: swRegistration,
    });
    getToken(messaging, {
      vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
      serviceWorkerRegistration: swRegistration,
    }).then((token) => console.log("FCM registration token:", token));
  }

  return messaging;
})();

const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export {
  accountsCollection,
  app,
  auth,
  db,
  eventsCollection,
  messagingReady,
  storage,
};
