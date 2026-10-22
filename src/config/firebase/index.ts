import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import { webSdkBaseConfig } from "./config";
import { accountsCollection, db, eventsCollection } from "./firestore";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require("firebase/auth");

const app = initializeApp({
  ...webSdkBaseConfig,
  appId: process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID,
});

const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { accountsCollection, app, auth, db, eventsCollection, storage };
