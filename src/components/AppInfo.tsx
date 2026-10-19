import { OS } from "@/constants/Os";
import { useTranslation } from "@/translations/i18n";
import { downloadAndInstallApk } from "@/utils/downloadAndInstallApk";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Alert } from "./Alert";
import Button from "./Button";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type AppInfoProps = {
  status?: "maintaince" | "outdated";
};

export default function AppInfo({ status = "maintaince" }: AppInfoProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: downloadAndInstallApk,
  });

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

      {isError && (
        <Alert
          variant="warning"
          size="regular"
          icon="warning"
          description={t("appInfo.downloadError")}
        />
      )}

      <Button
        content={isPending ? <LoadingIndicator /> : t("appInfo.updateButton")}
        accessibilityLabel={""}
        accessibilityHint={""}
        onPress={() => mutate()}
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
