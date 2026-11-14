import { Alert } from "@/components/Alert";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Recurrence } from "@/constants/Recurrence";
import { fetchAllEvents } from "@/services/firebase/events";
import { useTranslation } from "@/translations/i18n";
import { BottomSheetFlatList } from "@expo/ui/community/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";


export function SelectActivity({
  editActivityOpen,
  setEditActivityOpen,
}: {
  editActivityOpen: boolean;
  setEditActivityOpen: (value: boolean) => void;
}) {
  const { t } = useTranslation();
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
      scrollable={false}
    >
      {isLoadingEvents ? (
        <LoadingIndicator />
      ) : isErrorEvents ? (
        <Alert
          description={t("createActivity.getActivitiesError")}
          variant="warning"
          size="regular"
        />
      ) : !events || events.length === 0 ? (
        <Alert
          description={t("createActivity.getActivitiesEmpty")}
          variant="info"
          size="regular"
        />
      ) : (
        <BottomSheetFlatList
          data={events}
          keyExtractor={(event) => event.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: event }) => (
            <ListTile
              title={event.name}
              subtitle={`${event.recurrence === Recurrence.Daily ? "Elke dag" : "Elke"} ${format(event.startDate.toDate(), `${event.recurrence === Recurrence.Weekly ? "EEEE" : event.recurrence === Recurrence.Monthly ? "do" : ""} HH:mm`, { locale: nl })} - ${format(event.endDate.toDate(), isSameDay(event.endDate.toDate(), event.startDate.toDate()) ? "HH:mm" : "EEEE HH:mm", { locale: nl })}`}
              onPress={() => {
                setEditActivityOpen(false);
                router.push({
                  pathname: "/(tabs)/bestuur/update-activity",
                  params: { id: event.id },
                });
              }}
            />
          )}
        />
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
