import {
  getMessaging,
  getToken,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

export async function registerForPushNotifications(): Promise<void> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;
  const token = await getToken(getMessaging());
  console.log("FCM registration token:", token);
}

export async function requestUserPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === "granted") {
    const token = await getToken(getMessaging());
    console.log("FCM registration token:", token);
  }
  return status === "granted";
}
