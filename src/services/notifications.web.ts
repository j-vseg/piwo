import { webMessaging } from "@/config/firebase/index.web";
import { getToken, register } from "firebase/messaging";

export async function requestWebNotificationPermission(): Promise<NotificationPermission> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  const swRegistration = await navigator.serviceWorker.ready;
  register(webMessaging, {
    vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
    serviceWorkerRegistration: swRegistration,
  });
  getToken(webMessaging, {
    vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
    serviceWorkerRegistration: swRegistration,
  }).then((token) => console.log("FCM registration token:", token));

  return permission;
}
