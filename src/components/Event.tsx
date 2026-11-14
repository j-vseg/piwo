import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EventOccurrence } from "@/constants/EventOccurence";
import { OS } from "@/constants/Os";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { router } from "expo-router";
import { Platform, Pressable } from "react-native";
import { AvailabilitySelector } from "./AvailabilitySelector";

export default function Event({ occurrence }: { occurrence: EventOccurrence }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/home/activity",
          params: { id: occurrence.id },
        })
      }
    >
      <ThemedView style={styles.text}>
        <ThemedText type="bodyLarge">{occurrence.name}</ThemedText>
        <ThemedText type="bodySmall" style={styles.subtitle}>
          {`${format(occurrence.startTime.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occurrence.endTime.toDate(), isSameDay(occurrence.endTime.toDate(), occurrence.startTime.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
        </ThemedText>
      </ThemedView>

      <AvailabilitySelector occurrenceId={occurrence.id} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light["white"],
    borderRadius: theme.borderRadius["lg"],
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(5),
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  text: {
    gap: Platform.OS === OS.Web ? theme.spacing(1) : theme.spacing(4),
  },
  subtitle: {
    color: theme.colors.dark.greyMedium,
  },
}));
