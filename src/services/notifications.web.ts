import { messagingReady } from "@/config/firebase/index.web";
import { getToken, register } from "firebase/messaging";

export async function requestWebNotificationPermission(): Promise<NotificationPermission> {
  const messaging = await messagingReady;
  if (!messaging) return "default";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  const swRegistration = await navigator.serviceWorker.ready;
  register(messaging, {
    vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
    serviceWorkerRegistration: swRegistration,
  });
  getToken(messaging, {
    vapidKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_NOTIFICATION_KEY_PAIR,
    serviceWorkerRegistration: swRegistration,
  }).then((token) => console.log("FCM registration token:", token));

  return permission;
}
