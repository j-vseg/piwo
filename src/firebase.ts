import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getApps,
  initializeApp as initializeNativeApp,
  setReactNativeAsyncStorage,
} from "@react-native-firebase/app";
import { collection, getFirestore } from "@react-native-firebase/firestore";
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
import { Platform } from "react-native";

import { OS } from "@/constants/Os";

// Native Firebase setup
setReactNativeAsyncStorage(AsyncStorage);

if (getApps().length === 0) {
  initializeNativeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID!,
  });
}
const db = getFirestore();

const accountsCollection = collection(db, "accounts");
const eventsCollection = collection(db, "events");

// Web SDK — used on web for auth/storage
const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    Platform.OS === OS.Web
      ? process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID
      : process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID,
});

let webMessaging: ReturnType<typeof getMessaging> | undefined;
if (Platform.OS === OS.Web) {
  webMessaging = getMessaging(app);
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
      register(webMessaging!, {
        vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
        serviceWorkerRegistration: swRegistration,
      });
      // getToken is deprecated but needed to get the FCM registration token
      // for targeting from the Firebase Console "Send test message" flow.
      getToken(webMessaging!, {
        vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
        serviceWorkerRegistration: swRegistration,
      }).then((token) => console.log("FCM registration token:", token));
    });
}

const storage = getStorage(app);

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require("firebase/auth");

const auth = initializeAuth(app, {
  persistence:
    Platform.OS === "web"
      ? browserLocalPersistence
      : getReactNativePersistence(AsyncStorage),
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
