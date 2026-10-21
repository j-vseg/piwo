import "@/config/firebase";
import { getMessaging, onRegistered } from "firebase/messaging";

const messaging = getMessaging();
onRegistered(messaging, () => {});
