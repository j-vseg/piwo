import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getApps,
  initializeApp as initializeNativeApp,
  setReactNativeAsyncStorage,
} from "@react-native-firebase/app";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
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

// Web SDK — used on web for auth/firestore/storage, and on native for firestore (shared API)
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

const db = getFirestore(app);
const storage = getStorage(app);

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require("firebase/auth");

const auth = initializeAuth(app, {
  persistence:
    Platform.OS === "web"
      ? browserLocalPersistence
      : getReactNativePersistence(AsyncStorage),
});

const accountsCollection = collection(db, "accounts");
const eventsCollection = collection(db, "events");

export { accountsCollection, app, auth, db, eventsCollection, storage };
