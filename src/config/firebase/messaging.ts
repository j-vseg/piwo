import * as Notifications from "expo-notifications";
import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const messaging = getMessaging();

Notifications.getPermissionsAsync().then(({ status }) => {
  if (status === "granted") {
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
