import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Switch } from "@/components/Switch/Switch";
import { OS } from "@/constants/Os";
import { queryClient } from "@/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useTranslation } from "react-i18next";
import { Linking, Platform } from "react-native";

const NOTIFICATION_PERMISSION_QUERY_KEY = ["notification-permission"] as const;
const WEB_PUSH_SUPPORTED_QUERY_KEY = ["web-push-supported"] as const;
const WEB_NOTIFICATION_PERMISSION_QUERY_KEY = [
  "web-notification-permission",
] as const;

export function NotificationSettings() {
  const { t } = useTranslation();

  const { data: notificationPermission } = useQuery({
    queryKey: NOTIFICATION_PERMISSION_QUERY_KEY,
    queryFn: () => Notifications.getPermissionsAsync(),
    networkMode: "always",
    retry: false,
    enabled: Platform.OS !== OS.Web,
  });

  const notificationsEnabled = notificationPermission?.status === "granted";
  const permanentlyDenied =
    notificationPermission?.status === "denied" &&
    !notificationPermission?.canAskAgain;

  const { data: isWebPushSupported = false } = useQuery({
    queryKey: WEB_PUSH_SUPPORTED_QUERY_KEY,
    queryFn: async () => {
      const { isSupported } = await import("firebase/messaging");
      return isSupported();
    },
    networkMode: "always",
    retry: false,
    enabled: Platform.OS === OS.Web,
  });

  const { data: webPermission = "default" as NotificationPermission } =
    useQuery({
      queryKey: WEB_NOTIFICATION_PERMISSION_QUERY_KEY,
      queryFn: () => Promise.resolve(Notification.permission),
      networkMode: "always",
      retry: false,
      enabled: Platform.OS === OS.Web && isWebPushSupported,
    });

  const {
    mutate: toggleNotification,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async () => {
      if (notificationsEnabled) {
        Linking.openSettings();
        return;
      }

      const { status, canAskAgain } = await Notifications.getPermissionsAsync();
      if (status !== "granted" && !canAskAgain) {
        Linking.openSettings();
        return;
      }

      const permission = await Notifications.requestPermissionsAsync();
      queryClient.setQueryData(NOTIFICATION_PERMISSION_QUERY_KEY, permission);
    },
  });

  const {
    mutate: toggleWebNotification,
    isPending: isWebPending,
    isError: isWebError,
  } = useMutation({
    mutationFn: async () => {
      if (webPermission !== "default") {
        Linking.openSettings();
        return;
      }
      const { requestWebNotificationPermission } =
        await import("@/services/notifications.web");
      const result = await requestWebNotificationPermission();
      queryClient.setQueryData(WEB_NOTIFICATION_PERMISSION_QUERY_KEY, result);
    },
  });

  if (Platform.OS !== OS.Web) {
    return (
      <ListTile
        title={t("settings.notifications")}
        subtitle={
          notificationsEnabled
            ? t("settings.notificationsEnabled")
            : permanentlyDenied
              ? t("settings.notificationsDisabled")
              : undefined
        }
        onPress={() => toggleNotification()}
        iconRight={
          isPending ? (
            <LoadingIndicator />
          ) : isError ? (
            "warning"
          ) : (
            <Switch value={notificationsEnabled} />
          )
        }
        iconLeft={permanentlyDenied ? "settings" : undefined}
      />
    );
  }

  return (
    <ListTile
      title={t("settings.notifications")}
      subtitle={
        !isWebPushSupported
          ? t("settings.notificationsWebUnsupported")
          : webPermission === "granted"
            ? t("settings.notificationsWebEnabled")
            : webPermission === "denied"
              ? t("settings.notificationsWebDisabled")
              : undefined
      }
      onPress={() => toggleWebNotification()}
      iconRight={
        isWebPending ? (
          <LoadingIndicator />
        ) : isWebError ? (
          "warning"
        ) : (
          <Switch value={webPermission === "granted"} />
        )
      }
      disabled={!isWebPushSupported || isWebPending}
      iconLeft={
        webPermission !== "default" && isWebPushSupported
          ? "settings"
          : undefined
      }
    />
  );
}
