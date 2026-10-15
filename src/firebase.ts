import { getApps, initializeApp } from "@react-native-firebase/app";

if (getApps().length === 0) {
  initializeApp({
    apiKey: "AIzaSyChvrbrm_ky1ssjhuoNtt0acNHVN2-cNww",
    authDomain: "piwo-4487e.firebaseapp.com",
    databaseURL:
      "https://piwo-4487e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "piwo-4487e",
    storageBucket: "piwo-4487e.firebasestorage.app",
    messagingSenderId: "55318025403",
    appId: "1:55318025403:android:53e9b513e163c47e11859e",
  });
}
