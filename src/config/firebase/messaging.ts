import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

const messaging = getMessaging();

Notifications.getPermissionsAsync().then(({ status }) => {
  if (
    status === "granted" &&
    typeof Notification !== "undefined" &&
    Notification.permission === "granted"
  ) {
    // Deprecated but the only way to get the FCM registration token
    // needed for the Firebase Console "Send test message" flow.
    getToken(messaging).then((token: string) =>
      console.log("FCM registration token:", token),
    );
  }
});

setBackgroundMessageHandler(messaging, async (remoteMessage: unknown) => {
  console.log("Message handled in the background!", remoteMessage);
});
onMessage(messaging, (remoteMessage: unknown) => {
  console.log("FCM foreground message:", remoteMessage);
});
