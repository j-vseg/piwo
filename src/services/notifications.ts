import * as Notifications from "expo-notifications";

export async function requestUserPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}
