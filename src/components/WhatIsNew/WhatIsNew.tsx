import { Group } from "@/components/Group";
import { IconName, IconSymbol } from "@/components/IconSymbol/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { Role } from "@/constants/Role";
import { useAppStore } from "@/store/appStore";
import { Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type FeatureItem = {
  icon: IconName;
  webIcon: string;
  title: string;
  description: string;
  adminOnly?: boolean;
};

export const FEATURES_VERSION = 0;

const features: FeatureItem[] = [
  {
    icon: "notifications",
    webIcon: "notifications",
    title: "Pushmeldingen",
    description:
      "Ontvang pushmeldingen op Android en in de web-app. Schakel meldingen in of uit via de instellingen.",
  },
  {
    icon: "dark_mode",
    webIcon: "dark-mode",
    title: "Donker en licht thema",
    description:
      "De app past zich automatisch aan naar een donker of licht thema op basis van je systeeminstellingen.",
  },
  {
    icon: "person_remove",
    webIcon: "person-remove",
    title: "Toegang intrekken",
    description: "Trek de toegang van een gebruiker in wanneer nodig.",
    adminOnly: true,
  },
  {
    icon: "phone_android",
    webIcon: "phone-android",
    title: "Android app",
    description: "Piwo is nu beschikbaar als Android-app.",
  },
  {
    icon: "system_update",
    webIcon: "system-update",
    title: "App updates (Android-app)",
    description:
      "Ontvang een melding wanneer er een nieuwe versie van de app beschikbaar is.",
  },
  {
    icon: "install_mobile",
    webIcon: "get-app",
    title: "Installatiehandleidingen",
    description:
      "Stapsgewijze instructies voor het installeren van de app op Android en iOS.",
  },
];

function getIcon(feature: FeatureItem): IconName {
  return Platform.OS === OS.Web ? (feature.webIcon as IconName) : feature.icon;
}

export default function WhatIsNewOverview() {
  const { theme } = useUnistyles();
  const role = useAppStore((s) => s.role);
  const isAdmin = role === Role.BoardMember || role === Role.Advisor;

  const visibleFeatures = features.filter((f) => !f.adminOnly || isAdmin);

  return (
    <ThemedView style={styles.featureList}>
      {visibleFeatures.map((feature, index) => (
        <Group key={index}>
          <ThemedView style={styles.featureItem}>
            <ThemedView style={styles.iconContainer}>
              <IconSymbol
                size={24}
                name={getIcon(feature)}
                color={theme.colors.dark["black"]}
              />
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <ThemedText type="bodyLarge" weight="600">
                {feature.title}
              </ThemedText>
              <ThemedText type="bodySmall" style={styles.description}>
                {feature.description}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </Group>
      ))}
    </ThemedView>
  );
}
const styles = StyleSheet.create((theme) => ({
  featureList: {
    gap: theme.spacing(3),
  },
  featureItem: {
    flexDirection: "row",
    gap: theme.spacing(4),
    padding: theme.spacing(4),
    backgroundColor: theme.colors.light["white"],
    alignItems: "flex-start",
  },
  iconContainer: {
    backgroundColor: theme.colors.transparent,
    paddingTop: 2,
  },
  textContainer: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
    gap: theme.spacing(1),
  },
  description: {
    color: theme.colors.dark.greyMedium,
  },
}));
