import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EventOccurrence } from "@/constants/EventOccurence";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { AvailabilitySelector } from "./AvailabilitySelector";

export default function Event({ occurrence }: { occurrence: EventOccurrence }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/activity/${occurrence.id}`)}
    >
      <ThemedView>
        <ThemedText type="bodyLarge">{occurrence.name}</ThemedText>
        <ThemedText type="bodySmall" style={styles.subtitle}>
          {`${format(occurrence.startTime.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occurrence.endTime.toDate(), isSameDay(occurrence.endTime.toDate(), occurrence.startTime.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
        </ThemedText>
      </ThemedView>

      <AvailabilitySelector
        occurrenceId={occurrence.id}
        occurrenceCategory={occurrence.category}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.white,
    borderRadius: 16,
    padding: theme.spacing(4),
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  subtitle: {
    color: theme.colors.dark.greyMedium,
  },
}));
