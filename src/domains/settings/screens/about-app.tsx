import { Group } from "@/components/Group";
import { IconName, IconSymbol } from "@/components/IconSymbol/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { Role } from "@/constants/Role";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import { Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type FeatureItem = {
  icon: IconName;
  webIcon: string;
  translationKey: string;
  adminOnly?: boolean;
};

const features: FeatureItem[] = [
  { icon: "event", webIcon: "event", translationKey: "viewActivities" },
  { icon: "check_circle", webIcon: "check-circle", translationKey: "submitAvailability" },
  { icon: "groups", webIcon: "group", translationKey: "viewOthersAvailability" },
  { icon: "today", webIcon: "today", translationKey: "weekOverview" },
  { icon: "event_repeat", webIcon: "repeat", translationKey: "recurringActivities" },
  { icon: "edit_calendar", webIcon: "edit", translationKey: "manageActivities", adminOnly: true },
  { icon: "how_to_reg", webIcon: "how-to-reg", translationKey: "memberManagement", adminOnly: true },
  { icon: "person_edit", webIcon: "person", translationKey: "personalDetails" },
  { icon: "notifications", webIcon: "notifications", translationKey: "pushNotifications" },
  { icon: "credit_card", webIcon: "credit-card", translationKey: "buyBeerCard" },
  { icon: "install_mobile", webIcon: "get-app", translationKey: "installAsApp" },
];

function getIcon(feature: FeatureItem): IconName {
  return Platform.OS === OS.Web ? (feature.webIcon as IconName) : feature.icon;
}

export default function AboutAppScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const role = useAppStore((s) => s.role);
  const isAdmin = role === Role.BoardMember || role === Role.Advisor;

  const visibleFeatures = features.filter((f) => !f.adminOnly || isAdmin);

  return (
    <ThemedView type="container">
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
                  {t(`aboutApp.${feature.translationKey}.title`)}
                </ThemedText>
                <ThemedText type="bodySmall" style={styles.description}>
                  {t(`aboutApp.${feature.translationKey}.description`)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Group>
        ))}
      </ThemedView>
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
