import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { downloadAndInstallApk } from "@/utils/downloadAndInstallApk";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Linking, Platform } from "react-native";

export default function InstallationScreen() {
  const { t } = useTranslation();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: downloadAndInstallApk,
  });

  const {
    mutate: openLink,
    isPending: isPendingLink,
    isError: isErrorLink,
  } = useMutation({
    mutationFn: async (url: string) => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    },
  });

  return (
    <ThemedView type="container">
      <Group>
        <ListTile
          text={t("settings.installWebAppAndroid")}
          onPress={() =>
            openLink(
              "https://support.google.com/chrome/answer/9658361?hl=nl&co=GENIE.Platform%3DAndroid",
            )
          }
          iconLeft="language"
          iconRight={
            isPendingLink
              ? "downloading"
              : isErrorLink
                ? "warning"
                : Platform.OS === OS.Web
                  ? ("chevron-right" as any)
                  : "chevron_forward"
          }
        />
        <ListTile
          text={t("settings.installWebAppApple")}
          onPress={() => openLink("https://support.apple.com/nl-nl/104996")}
          iconLeft="language"
          iconRight={
            isPendingLink
              ? "downloading"
              : isErrorLink
                ? "warning"
                : Platform.OS === OS.Web
                  ? ("chevron-right" as any)
                  : "chevron_forward"
          }
        />
        <ListTile
          text={t("settings.installApk")}
          onPress={() =>
            openLink("https://www.youtube.com/watch?v=qe48iIleM5U")
          }
          iconLeft="language"
          iconRight={
            isPendingLink
              ? "downloading"
              : isErrorLink
                ? "warning"
                : Platform.OS === OS.Web
                  ? ("chevron-right" as any)
                  : "chevron_forward"
          }
        />
        <ListTile
          text={t("settings.downloadApk")}
          onPress={() => mutate()}
          iconLeft="android"
          iconRight={
            isPending
              ? "downloading"
              : isError
                ? "warning"
                : isSuccess
                  ? "done"
                  : "download"
          }
        />
      </Group>
    </ThemedView>
  );
}
