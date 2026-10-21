import { OS } from "@/constants/Os";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestUserPermission() {
  if (Platform.OS === OS.Web) {
    await Notification.requestPermission();
  } else {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  }
}
