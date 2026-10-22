import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const messaging = getMessaging();

getToken(messaging).then((token: string) =>
  console.log("FCM registration token:", token),
);

setBackgroundMessageHandler(messaging, async (remoteMessage: unknown) => {
  console.log("Message handled in the background!", remoteMessage);
});
onMessage(messaging, async (remoteMessage) => {
  console.log("FCM foreground message:", remoteMessage);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: remoteMessage.notification?.title ?? "Notification",
      body: remoteMessage.notification?.body,
    },
    trigger: null,
  });
});
