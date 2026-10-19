import { OS } from "@/constants/Os";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Linking, Platform } from "react-native";

const APK_URL = "https://github.com/j-vseg/piwo/releases/latest/download/piwo.apk";

export async function downloadAndInstallApk() {
  if (Platform.OS === OS.Web) {
    Linking.openURL(APK_URL);
    return;
  }

  const destination = new File(Paths.cache, "piwo.apk");
  await File.downloadFileAsync(APK_URL, destination);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(destination.uri, {
      mimeType: "application/vnd.android.package-archive",
      dialogTitle: "Install Piwo",
    });
  }
}
