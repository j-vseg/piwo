import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView type="container">
      <ThemedText type="h1">{t("tabs.settings.personalDetails")}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));
