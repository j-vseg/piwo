import { Alert } from "@/components/Alert";
import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { signOut } from "@/services/firebase/auth";
import { getBeerCardUrl } from "@/services/firebase/beer-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking, Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { DeleteAccountSettings } from "../components/DeleteAccountSettings";
import { NotificationSettings } from "../components/NotificationSettings";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const { data: greenBeerCardUrl, isError: isErrorGreenBeerCard } = useQuery({
    queryKey: ["beer-card-url", "green"],
    queryFn: () => getBeerCardUrl("green"),
  });
  const { data: pinkBeerCardUrl, isError: isErrorPinkBeerCard } = useQuery({
    queryKey: ["beer-card-url", "pink"],
    queryFn: () => getBeerCardUrl("pink"),
  });

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
            <NotificationSettings />
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
            <DeleteAccountSettings />
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
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));
