import { useMemo } from "react";
import { StyleSheet } from "react-native-unistyles";

import { Divider } from "@/components/Divider";
import Event from "@/components/Event";
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
    <ThemedView type="container">
      <ThemedText type="h1">{t("tabs.home")}</ThemedText>
      <ThisWeek />

      <ThemedText type="h2">{t("home.upcomingActivities")}</ThemedText>

      <ThemedView style={styles.list}></ThemedView>
      {groupedOccurrences?.map((item) => (
        <ThemedView key={item.date.toDateString()} style={styles.listItem}>
          <Divider label={format(item.date, "E d MMM", { locale: nl })} />
          {item.occurrences.map((occurrence) => (
            <Event key={occurrence.id} occurrence={occurrence} />
          ))}
        </ThemedView>
      ))}
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
