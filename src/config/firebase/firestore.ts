import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getApps,
  initializeApp as initializeNativeApp,
  setReactNativeAsyncStorage,
} from "@react-native-firebase/app";
import { collection, getFirestore } from "@react-native-firebase/firestore";

import { firebaseConfig } from "./config";

setReactNativeAsyncStorage(AsyncStorage);

if (getApps().length === 0) {
  initializeNativeApp(firebaseConfig);
}

export const db = getFirestore();
export const accountsCollection = collection(db, "accounts");
export const eventsCollection = collection(db, "events");
