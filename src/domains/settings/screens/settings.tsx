import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";
import { SelectActivity } from "../components/SelectActivity";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [editActivityOpen, setEditActivityOpen] = useState(false);

  return (
    <ThemedView type="container">
      <ThemedText type="h1">{t("tabs.settings.main")}</ThemedText>

      <ThemedView style={styles.group}>
        <ThemedText type="h5">{t("settings.activitiesHeader")}</ThemedText>
        <Group>
          <ListTile
            text={t("tabs.settings.createActivity")}
            onPress={() => router.push("/(tabs)/settings/create-activity")}
          />
          <ListTile
            text={t("tabs.settings.editActivity")}
            onPress={() => setEditActivityOpen(true)}
          />
        </Group>
      </ThemedView>

      <SelectActivity
        editActivityOpen={editActivityOpen}
        setEditActivityOpen={setEditActivityOpen}
      />

      <ThemedView style={styles.group}>
        <ThemedText type="h5">{t("settings.accountHeader")}</ThemedText>
        <Group>
          <ListTile
            text={t("tabs.settings.personalDetails")}
            onPress={() => router.push("/(tabs)/settings/personal-details")}
          />
          <ListTile
            text={t("settings.signOut")}
            onPress={() => console.log("yes")}
          />
          <ListTile
            text={t("settings.deleteAccount")}
            onPress={() => console.log("yes")}
          />
        </Group>
      </ThemedView>

      <ThemedView style={styles.group}>
        <ThemedText type="h5">{t("settings.aboutHeader")}</ThemedText>
        <Group>
          <ListTile
            text={t("settings.whatsNew")}
            onPress={() => console.log("yes")}
          />
          <ListTile
            text={t("settings.aboutApp")}
            onPress={() => console.log("yes")}
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
