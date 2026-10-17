import { useMemo } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Alert } from "@/components/Alert";
import { Divider } from "@/components/Divider";
import Event from "@/components/Event";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchAllOccurrencesGroupedByDate } from "@/services/firebase/events";
import { useTranslation } from "@/translations/i18n";
import { useQuery } from "@tanstack/react-query";
import { format, nextMonday, startOfToday } from "date-fns";
import { nl } from "date-fns/locale";
import ThisWeek from "../components/ThisWeek";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const upcomingMonday = useMemo(() => {
    return nextMonday(startOfToday());
  }, []);
  const {
    data: groupedOccurrences,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["occurrences-grouped", upcomingMonday],
    queryFn: () => fetchAllOccurrencesGroupedByDate(upcomingMonday),
  });

  return (
    <ThemedView type="container" style={{ gap: theme.spacing(8) }}>
      <ThemedText type="h1">{t("tabs.home")}</ThemedText>
      <ThisWeek />

      <ThemedView style={{ gap: theme.spacing(4) }}>
        <ThemedText type="h2">{t("home.upcomingActivities")}</ThemedText>

        {isLoading && <LoadingIndicator />}
        {isError && (
          <Alert
            variant={"warning"}
            description={t("home.errorLoadingActivities")}
            size={"regular"}
          />
        )}
        {groupedOccurrences?.map((item) => (
          <ThemedView key={item.date.toDateString()} style={styles.listItem}>
            <Divider label={format(item.date, "E d MMM", { locale: nl })} />
            {item.occurrences.map((occurrence) => (
              <Event key={occurrence.id} occurrence={occurrence} />
            ))}
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    gap: theme.spacing(6),
  },
  listItem: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
}));
