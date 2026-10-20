import { OS } from "@/constants/Os";
import { useTranslation } from "@/translations/i18n";
import { downloadAndInstallApk } from "@/utils/downloadAndInstallApk";
import { getPageUrl } from "@/utils/getPageUrl";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useState } from "react";
import { Linking, Platform, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Alert } from "./Alert";
import BottomSheet from "./BottomSheet/BottomSheet";
import Button from "./Button";
import IntegratedWebView from "./IntegratedWebView";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type AppInfoProps = {
  status?: "outdated";
};

export default function AppInfo({ status = "outdated" }: AppInfoProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const [newOpen, setNewOpen] = useState(false);
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: downloadAndInstallApk,
    onError: (error) => console.log(error),
  });

  const { mutate: openLink } = useMutation({
    mutationFn: async (url: string) => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    },
  });

  return (
    <>
      <ThemedView type="container" style={styles.container}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 80, height: 80 }}
        />
        <ThemedView style={styles.content}>
          <ThemedText type="h1" style={styles.title}>
            {t("appInfo.outdatedTitle")}
          </ThemedText>
          <ThemedText style={styles.messageText}>
            {t("appInfo.outdatedMessage")}
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

        <ThemedView style={styles.button}>
          <Button
            content={t("tabs.settings.whatIsNew")}
            accessibilityLabel={""}
            accessibilityHint={""}
            onPress={() => setNewOpen(true)}
            type="secondary"
            iconLeft="stars_2"
          />
          <Button
            content={
              isPending ? (
                <LoadingIndicator />
              ) : isSuccess ? (
                t("appInfo.apkDownloaded")
              ) : (
                t("appInfo.updateButton")
              )
            }
            accessibilityLabel={""}
            accessibilityHint={""}
            onPress={() => mutate()}
            iconLeft={isSuccess ? "check" : "android"}
            buttonStyle={
              isSuccess
                ? {
                    backgroundColor: theme.colors.warnings.positive,
                    borderColor: theme.colors.warnings.positive,
                  }
                : undefined
            }
          />
          <Pressable
            hitSlop={20}
            onPress={() =>
              openLink("https://www.youtube.com/watch?v=qe48iIleM5U")
            }
          >
            <ThemedText
              style={{ textDecorationLine: "underline" }}
              type="bodySmaller"
            >
              {t("appInfo.installApkHelp")}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <BottomSheet
        title={t("tabs.settings.whatIsNew")}
        isPresented={newOpen}
        onDismiss={() => setNewOpen(false)}
      >
        <IntegratedWebView url={getPageUrl("/what-is-new")} />
      </BottomSheet>
    </>
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
  button: {
    gap: theme.spacing(1),
  },
}));
