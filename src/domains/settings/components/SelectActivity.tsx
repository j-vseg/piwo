import BottomSheet from "@/components/BottomSheet/BottomSheet";
import { ErrorMessage } from "@/components/ErrorMessage";
import { IconSymbol } from "@/components/IconSymbol/IconSymbol";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { Recurrence } from "@/constants/Recurrence";
import { fetchAllEvents } from "@/services/firebase/events";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { router } from "expo-router";
import { FlatList, Platform, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export function SelectActivity({
  editActivityOpen,
  setEditActivityOpen,
}: {
  editActivityOpen: boolean;
  setEditActivityOpen: (value: boolean) => void;
}) {
  const { theme } = useUnistyles();
  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useQuery({
    queryKey: ["all-events"],
    queryFn: () => fetchAllEvents(),
  });

  return (
    <BottomSheet
      title={"Selecteer een activiteit"}
      isPresented={editActivityOpen}
      onDismiss={() => setEditActivityOpen(false)}
    >
      {isLoadingEvents ? (
        <LoadingIndicator />
      ) : isErrorEvents ? (
        <ErrorMessage>
          Er is een fout opgetreden bij het ophalen van de activiteiten
        </ErrorMessage>
      ) : !events ? (
        <ErrorMessage>
          Er zijn geen activiteiten gevonden om te wijzigen
        </ErrorMessage>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(event) => event.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: event }) => (
            <Pressable
              style={styles.container}
              onPress={() => {
                setEditActivityOpen(false);
                router.push({
                  pathname: "/(tabs)/settings/update-activity",
                  params: { id: event.id },
                });
              }}
            >
              <ThemedView>
                <ThemedText type="bodyMedium">{event.name}</ThemedText>
                <ThemedText type="bodySmall" style={styles.subtitle}>
                  {`${event.recurrence === Recurrence.Daily ? "Elke dag" : "Elke"} ${format(event.startDate.toDate(), `${event.recurrence === Recurrence.Weekly ? "EEEE" : event.recurrence === Recurrence.Monthly ? "do" : ""} HH:mm`, { locale: nl })} - ${format(event.endDate.toDate(), isSameDay(event.endDate.toDate(), event.startDate.toDate()) ? "HH:mm" : "EEEE HH:mm", { locale: nl })}`}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={styles.rightContainer}
                importantForAccessibility="no-hide-descendants"
              >
                <IconSymbol
                  size={24}
                  name={
                    Platform.OS === OS.Web
                      ? ("angle-right" as any)
                      : "chevron_forward"
                  }
                  color={theme.colors.dark["black"]}
                  accessible={false}
                />
              </ThemedView>
            </Pressable>
          )}
        />
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    borderRadius: 16,
    overflow: "hidden",
  },
  container: {
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(2),
    minHeight: 56,
    margin: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing(4),
    backgroundColor: theme.colors.light["white"],
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.colors.dark["greyLight"],
  },
  rightContainer: {
    backgroundColor: theme.colors.transparent,
    flexDirection: "row",
  },
  subtitle: {
    color: theme.colors.dark.greyMedium,
  },
}));
