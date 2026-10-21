const { config } = require("dotenv");
const { existsSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const scriptDir = __dirname;
const IS_PROD = process.env.APP_VARIANT === "production";
const envFile = IS_PROD ? ".env.prod" : ".env.dev";
const envPath = resolve(scriptDir, "..", envFile);

if (!existsSync(envPath)) {
  console.error(`Missing ${envFile} — cannot generate firebase-messaging-sw.js`);
  process.exit(1);
}

config({ path: envPath });

const firebaseConfig = JSON.stringify({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID,
});

const output = `importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js");

firebase.initializeApp(${firebaseConfig});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);
  self.registration.showNotification(payload.notification?.title, {
    body: payload.notification?.body,
  });
});
`;

const dest = resolve(scriptDir, "..", "public", "firebase-messaging-sw.js");
writeFileSync(dest, output);
console.log(
  "Generated firebase-messaging-sw.js (" +
    (IS_PROD ? "production" : "development") +
    ")",
);
