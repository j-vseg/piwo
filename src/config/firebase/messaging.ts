import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const messaging = getMessaging();
getToken(messaging).then((token: string) =>
  console.log("FCM registration token:", token),
);
setBackgroundMessageHandler(messaging, async (remoteMessage: unknown) => {
  console.log("Message handled in the background!", remoteMessage);
});
onMessage(messaging, (remoteMessage: unknown) => {
  console.log("FCM foreground message:", remoteMessage);
});
