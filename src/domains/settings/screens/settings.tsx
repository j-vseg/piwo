import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView type="container">
      <ThemedText type="h1">{t("tabs.settings")}</ThemedText>

      <ThemedView style={styles.group}>
        <ThemedText type="h5">Activiteiten</ThemedText>
        <Group>
          <ListTile
            text={"Creeer activiteit"}
            onPress={() => console.log("yes")}
          />
          <ListTile
            text={"Wijzig activiteit"}
            onPress={() => console.log("yes")}
          />
        </Group>
      </ThemedView>

      <ThemedView style={styles.group}>
        <ThemedText type="h5">Account</ThemedText>
        <Group>
          <ListTile
            text={"Persoonlijke gegevens"}
            onPress={() => console.log("yes")}
          />
          <ListTile text={"Uitloggen"} onPress={() => console.log("yes")} />
          <ListTile
            text={"Account verwijderen"}
            onPress={() => console.log("yes")}
          />
        </Group>
      </ThemedView>

      <ThemedView style={styles.group}>
        <ThemedText type="h5">Over de app</ThemedText>
        <Group>
          <ListTile
            text={"Wat is er nieuw?"}
            onPress={() => console.log("yes")}
          />
          <ListTile
            text={"Wat kun je doen met de Piwo app?"}
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
