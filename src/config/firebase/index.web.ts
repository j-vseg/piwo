import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import {
  getMessaging,
  getToken,
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

const webMessaging = getMessaging(app);
onRegistered(webMessaging, (fid) => {
  console.log("FCM FID:", fid);
});
onMessage(webMessaging, (payload) => {
  console.log("FCM foreground message:", payload);
  new Notification(payload.notification?.title ?? "Notification", {
    body: payload.notification?.body,
  });
});
navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((swRegistration) => {
    const config = {
      type: "FIREBASE_CONFIG",
      config: { ...webSdkBaseConfig, appId: process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID },
    };
    if (swRegistration.active) {
      swRegistration.active.postMessage(config);
    } else {
      navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage(config));
    }

    if (Notification.permission !== "granted") return;

    register(webMessaging, {
      vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
      serviceWorkerRegistration: swRegistration,
    });
    // Deprecated but the only way to get the FCM registration token
    // needed for the Firebase Console "Send test message" flow.
    getToken(webMessaging, {
      vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
      serviceWorkerRegistration: swRegistration,
    }).then((token) => console.log("FCM registration token:", token));
  });

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
  storage,
  webMessaging,
};
