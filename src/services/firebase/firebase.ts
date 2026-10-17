import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from "firebase/auth";
import { Platform } from "react-native";

import { OS } from "@/constants/Os";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const clientCredentials = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    Platform.OS === OS.Web
      ? process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID
      : process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID,
};

const app = initializeApp(clientCredentials);

const db = getFirestore(app);
const storage = getStorage(app);
const auth =
  Platform.OS === "web"
    ? initializeAuth(app, { persistence: browserLocalPersistence })
    : getAuth(app);

const accountsCollection = collection(db, "accounts");
const eventsCollection = collection(db, "events");

export { accountsCollection, app, auth, db, eventsCollection, storage };

