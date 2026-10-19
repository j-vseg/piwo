import { OS } from "@/constants/Os";
import { useTranslation } from "@/translations/i18n";
import { Image } from "expo-image";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Button from "./Button";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type AppInfoProps = {
  status?: "maintaince" | "outdated";
};

export default function AppInfo({ status = "maintaince" }: AppInfoProps) {
  const { t } = useTranslation();

  return (
    <ThemedView type="container" style={styles.container}>
      <Image
        source={require("@/assets/images/icon.png")}
        style={{ width: 80, height: 80 }}
      />
      <ThemedView style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          {status === "maintaince"
            ? t("appInfo.maintenanceTitle")
            : t("appInfo.outdatedTitle")}
        </ThemedText>
        <ThemedText style={styles.messageText}>
          {status === "maintaince"
            ? t("appInfo.maintenanceMessage")
            : t("appInfo.outdatedMessage")}
        </ThemedText>
      </ThemedView>

      <Button
        content={"Update de app"}
        accessibilityLabel={""}
        accessibilityHint={""}
        onPress={() => console.log("yes")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.screen.default.backgroundColor,
    gap: theme.spacing(10),
    paddingTop:
      Platform.OS === OS.Web
        ? rt.insets.top + theme.spacing(6)
        : rt.insets.top + theme.spacing(4),
  },
  content: {
    alignItems: "center",
    gap: theme.spacing(2),
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
    fontFamily: theme.font.crimsonPro.semibold.fontFamily,
  },
  messageText: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
}));
