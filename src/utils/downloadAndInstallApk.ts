import { Linking } from "react-native";

const APK_URL =
  "https://github.com/j-vseg/piwo/releases/latest/download/piwo.apk";

export async function downloadAndInstallApk() {
  await Linking.openURL(APK_URL);
}
