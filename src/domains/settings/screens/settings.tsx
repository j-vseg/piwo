import { Alert } from "@/components/Alert";
import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { deleteUserAccount } from "@/services/firebase/accounts";
import { getCurrentUser, signOut } from "@/services/firebase/auth";
import { getBeerCardUrl } from "@/services/firebase/beer-card";
import { Host, Switch } from "@expo/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppState, Linking, Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ConfirmPassword } from "../../../components/ConfirmPassword";

type DeleteAccountFormData = {
  oldPassword: string;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const [passwordConfirmOpen, setPasswordConfirmOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permanentlyDenied, setPermanentlyDenied] = useState(false);
  const [isWebPushSupported, setIsWebPushSupported] = useState(false);
  const [webPermission, setWebPermission] =
    useState<NotificationPermission>("default");
  const { data: greenBeerCardUrl, isError: isErrorGreenBeerCard } = useQuery({
    queryKey: ["beer-card-url", "green"],
    queryFn: () => getBeerCardUrl("green"),
  });
  const { data: pinkBeerCardUrl, isError: isErrorPinkBeerCard } = useQuery({
    queryKey: ["beer-card-url", "pink"],
    queryFn: () => getBeerCardUrl("pink"),
  });

  useEffect(() => {
    if (Platform.OS !== OS.Web) return;

    import("firebase/messaging").then(({ isSupported }) =>
      isSupported().then((supported) => setIsWebPushSupported(supported)),
    );
  }, []);

  useEffect(() => {
    if (!isWebPushSupported) return;

    navigator.permissions.query({ name: "notifications" }).then((status) => {
      setWebPermission(Notification.permission);
      status.onchange = () => setWebPermission(Notification.permission);
    });
  }, [isWebPushSupported]);

  useEffect(() => {
    if (Platform.OS === OS.Web) return;

    const checkPermission = async () => {
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
      setPermanentlyDenied(status === "denied" && !canAskAgain);
    };

    checkPermission();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkPermission();
    });

    return () => subscription.remove();
  }, []);

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

      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      setNotificationsEnabled(newStatus === "granted");
    },
  });

  const {
    mutate: toggleWebNotification,
    isPending: isWebPending,
    isError: isWebError,
  } = useMutation({
    mutationFn: async () => {
      if (webPermission !== "default") return;
      const { requestWebNotificationPermission } =
        await import("@/services/notifications.web");
      const result = await requestWebNotificationPermission();
      setWebPermission(result);
    },
  });

  const user = getCurrentUser();
  const deleteAccountForm = useForm<DeleteAccountFormData>({
    defaultValues: { oldPassword: "" },
  });

  const {
    mutate: mutateDelete,
    isPending: isDeletePending,
    isError: isDeleteError,
  } = useMutation({
    mutationFn: async (password: string) => {
      await deleteUserAccount(user!, password);
    },
    onSuccess: () => setPasswordConfirmOpen(false),
  });

  const handleDeleteConfirm = () => {
    deleteAccountForm.handleSubmit((data) => {
      mutateDelete(data.oldPassword.trim());
    })();
  };

  const {
    mutate: mutateLogout,
    isPending: isLogoutPending,
    isError: isLogoutError,
  } = useMutation({
    mutationFn: signOut,
  });

  const { mutate: openLink, isPending: isPendingOpenLink } = useMutation({
    mutationFn: async (url: string) => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    },
  });

  return (
    <>
      <ThemedView
        type="container"
        style={{
          gap: theme.spacing(10),
          paddingTop:
            Platform.OS === OS.Web
              ? rt.insets.top + theme.spacing(6)
              : rt.insets.top + theme.spacing(4),
        }}
      >
        <ThemedText type="h1">{t("tabs.settings.main")}</ThemedText>

        <ThemedView style={styles.group}>
          <ThemedText type="h5">{t("bestuur.beer_card.title")}</ThemedText>
          {(isErrorGreenBeerCard || !greenBeerCardUrl) &&
            (isErrorPinkBeerCard || !pinkBeerCardUrl) && (
              <Alert
                variant="warning"
                description={t("bestuur.beer_card.fetch_error")}
                size={"regular"}
              />
            )}
          {(isErrorGreenBeerCard || !greenBeerCardUrl) &&
            !(isErrorPinkBeerCard || !pinkBeerCardUrl) && (
              <Alert
                variant="warning"
                description={t("bestuur.beer_card.fetch_error_green")}
                size={"regular"}
              />
            )}
          {(isErrorPinkBeerCard || !pinkBeerCardUrl) &&
            !(isErrorGreenBeerCard || !greenBeerCardUrl) && (
              <Alert
                variant="warning"
                description={t("bestuur.beer_card.fetch_error_pink")}
                size={"regular"}
              />
            )}
          {(greenBeerCardUrl || pinkBeerCardUrl) && (
            <Group>
              {greenBeerCardUrl && (
                <ListTile
                  title={t("bestuur.beer_card.buy_green")}
                  onPress={() => openLink(greenBeerCardUrl)}
                  iconLeft={
                    Platform.OS === OS.Web ? "sports-bar" : "sports_bar"
                  }
                  iconRight={
                    isPendingOpenLink ? (
                      <LoadingIndicator />
                    ) : Platform.OS === OS.Web ? (
                      ("chevron-right" as any)
                    ) : (
                      "chevron_forward"
                    )
                  }
                />
              )}
              {pinkBeerCardUrl && (
                <ListTile
                  title={t("bestuur.beer_card.buy_pink")}
                  onPress={() => openLink(pinkBeerCardUrl)}
                  iconLeft={
                    Platform.OS === OS.Web ? "local-bar" : "local_bar"
                  }
                  iconRight={
                    isPendingOpenLink ? (
                      <LoadingIndicator />
                    ) : Platform.OS === OS.Web ? (
                      ("chevron-right" as any)
                    ) : (
                      "chevron_forward"
                    )
                  }
                />
              )}
            </Group>
          )}
        </ThemedView>

        <ThemedView style={styles.group}>
          <ThemedText type="h5">{t("settings.accountHeader")}</ThemedText>
          <Group>
            <ListTile
              title={t("tabs.settings.personalDetails")}
              onPress={() => router.push("/(tabs)/settings/personal-details")}
            />
            {Platform.OS !== OS.Web ? (
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
                    <Host matchContents>
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={() => toggleNotification()}
                      />
                    </Host>
                  )
                }
                iconLeft={permanentlyDenied ? "settings" : undefined}
              />
            ) : (
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
                    <Host matchContents>
                      <Switch
                        value={webPermission === "granted"}
                        onValueChange={() => toggleWebNotification()}
                        disabled={webPermission !== "default" || isWebPending}
                      />
                    </Host>
                  )
                }
                disabled={
                  !isWebPushSupported ||
                  webPermission !== "default" ||
                  isWebPending
                }
              />
            )}
            <ListTile
              title={t("settings.signOut")}
              onPress={() => mutateLogout()}
              subtitle={isLogoutError ? t("settings.signOutError") : undefined}
              iconRight={
                isLogoutPending ? (
                  <LoadingIndicator />
                ) : isLogoutError ? (
                  "warning"
                ) : Platform.OS === OS.Web ? (
                  ("chevron-right" as any)
                ) : (
                  "chevron_forward"
                )
              }
              disabled={isLogoutPending}
            />
            <ListTile
              title={t("settings.deleteAccount")}
              subtitle={
                isDeleteError ? t("settings.deleteAccountError") : undefined
              }
              onPress={() => setPasswordConfirmOpen(true)}
              textStyle={{ color: theme.colors.warnings.negative }}
              iconRight={
                isDeletePending ? (
                  <LoadingIndicator />
                ) : isDeleteError ? (
                  "warning"
                ) : Platform.OS === OS.Web ? (
                  ("chevron-right" as any)
                ) : (
                  "chevron_forward"
                )
              }
              disabled={isDeletePending}
            />
          </Group>
        </ThemedView>

        <ThemedView style={styles.group}>
          <ThemedText type="h5">{t("settings.aboutHeader")}</ThemedText>
          <Group>
            <ListTile
              title={t("tabs.settings.whatIsNew.title")}
              onPress={() => router.push("/(tabs)/settings/what-is-new")}
              iconLeft={Platform.OS === OS.Web ? "stars" : "stars_2"}
            />
            <ListTile
              title={t("tabs.settings.aboutApp")}
              onPress={() => router.push("/(tabs)/settings/about-app")}
            />
            <ListTile
              title={t("tabs.settings.installation")}
              onPress={() => router.push("/(tabs)/settings/installation")}
            />
          </Group>
        </ThemedView>
      </ThemedView>

      <ConfirmPassword
        isOpen={passwordConfirmOpen}
        onDismiss={() => setPasswordConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        control={deleteAccountForm.control as unknown as Control<FieldValues>}
        description={t("settings.deleteAccountDescription")}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));
