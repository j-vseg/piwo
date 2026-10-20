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

const features: FeatureItem[] = [
  {
    icon: "event",
    webIcon: "event",
    title: "Activiteiten bekijken",
    description:
      "Bekijk alle aankomende activiteiten, inclusief groepsavonden, weekenden, kampen en acties.",
  },
  {
    icon: "check_circle",
    webIcon: "check-circle",
    title: "Aanwezigheid opgeven",
    description:
      "Geef per activiteit aan of je aanwezig, afwezig of misschien komt. Houd het aanwezig-knopje lang ingedrukt om de status 'Later' te selecteren.",
  },
  {
    icon: "groups",
    webIcon: "group",
    title: "Aanwezigheid van anderen bekijken",
    description:
      "Bekijk per activiteit wie er komt, wie er misschien komt en wie er niet bij is.",
  },
  {
    icon: "today",
    webIcon: "today",
    title: "Weekoverzicht",
    description:
      "Zie in één oogopslag alle activiteiten van deze week en of je je aanwezigheid al hebt opgegeven.",
  },
  {
    icon: "event_repeat",
    webIcon: "repeat",
    title: "Terugkerende activiteiten",
    description:
      "Activiteiten kunnen dagelijks, wekelijks of maandelijks terugkeren. Geef je aanwezigheid per keer op.",
  },
  {
    icon: "edit_calendar",
    webIcon: "edit",
    title: "Activiteiten beheren",
    description:
      "Maak nieuwe activiteiten aan, bewerk bestaande activiteiten en verwijder activiteiten die niet meer nodig zijn.",
    adminOnly: true,
  },
  {
    icon: "how_to_reg",
    webIcon: "how-to-reg",
    title: "Ledenbeheer",
    description:
      "Keur nieuwe gebruikers goed of af, ken rollen toe en trek toegang in wanneer nodig.",
    adminOnly: true,
  },
  {
    icon: "person_edit",
    webIcon: "person",
    title: "Persoonlijke gegevens aanpassen",
    description:
      "Wijzig je naam, e-mailadres of wachtwoord via de instellingen.",
  },
  {
    icon: "install_mobile",
    webIcon: "get-app",
    title: "Installeren als app",
    description:
      "Installeer de Piwo app als web-app op je telefoon of download de Android-app.",
  },
];

function getIcon(feature: FeatureItem): IconName {
  return Platform.OS === OS.Web ? (feature.webIcon as IconName) : feature.icon;
}

export default function AboutAppScreen() {
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
