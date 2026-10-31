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

export const FEATURES_VERSION = 1;

const features: FeatureItem[] = [
  {
    icon: "lock",
    webIcon: "lock",
    title: "Wachtwoord vergeten",
    description:
      "Wachtwoord vergeten? Vraag een herstellink aan via het inlogscherm.",
  },
  {
    icon: "credit_card",
    webIcon: "credit-card",
    title: "Bierkaart kopen",
    description: "Koop een bierkaart via een betaallink in de instellingen.",
  },
  {
    icon: "edit",
    webIcon: "edit",
    title: "Bierkaart-link beheren",
    description: "Pas als penningmeester de betaallink voor de bierkaart aan.",
    adminOnly: true,
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
