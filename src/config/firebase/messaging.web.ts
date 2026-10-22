import "@/config/firebase";
import { getMessaging, isSupported, onRegistered } from "firebase/messaging";

isSupported().then((supported) => {
  if (!supported) return;
  const messaging = getMessaging();
  onRegistered(messaging, () => {});
});
