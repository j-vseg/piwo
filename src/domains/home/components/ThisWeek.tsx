import { StyleSheet } from "react-native-unistyles";

import { Alert } from "@/components/Alert";
import { ErrorMessage } from "@/components/ErrorMessage";
import Event from "@/components/Event";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getCurrentUser } from "@/services/firebase/auth";
import { isUserMissingAvailability } from "@/services/firebase/availability";
import { fetchAllOccurrences } from "@/services/firebase/events";
import { useTranslation } from "@/translations/i18n";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, startOfToday, startOfWeek } from "date-fns";
import { useMemo } from "react";

export default function ThisWeek() {
  const { t } = useTranslation();
  const user = getCurrentUser();
  const startOfTheWeek = useMemo(() => {
    return startOfWeek(startOfToday(), { weekStartsOn: 1 });
  }, []);
  const endOfTheWeek = useMemo(() => {
    return endOfWeek(startOfToday(), { weekStartsOn: 1 });
  }, []);
  const {
    data: thisWeekOccurrences,
    isLoading: isLoadingThisWeek,
    isError: isErrorThisWeek,
  } = useQuery({
    queryKey: ["this-week-occurrences", startOfTheWeek, endOfTheWeek],
    queryFn: () => fetchAllOccurrences(startOfTheWeek, endOfTheWeek),
  });

  const {
    data: userIsMissingAvailability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailabilty,
  } = useQuery({
    queryKey: ["has-entered-weekly-availability", thisWeekOccurrences],
    queryFn: () => isUserMissingAvailability(user!.uid, thisWeekOccurrences!),
    enabled: !!thisWeekOccurrences && !!user,
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2">{t("home.thisWeek")}</ThemedText>
      {isLoadingThisWeek || isLoadingAvailability ? (
        <LoadingIndicator />
      ) : isErrorThisWeek || isErrorAvailabilty ? (
        <ErrorMessage>{t("home.thisWeekError")}</ErrorMessage>
      ) : (
        <>
          <Alert
            variant={userIsMissingAvailability ? "warning" : "success"}
            description={t(
              userIsMissingAvailability
                ? "home.availabilityMissing"
                : "home.availabilityComplete",
            )}
            size="regular"
          />
          {thisWeekOccurrences?.map((item) => (
            <Event key={item.id} occurrence={item} />
          ))}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  list: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
}));
