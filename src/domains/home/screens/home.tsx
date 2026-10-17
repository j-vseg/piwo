import { useMemo } from "react";
import { StyleSheet } from "react-native-unistyles";

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
          <ThemedView style={styles.title}>
            <ThemedText type="bodySmaller" style={styles.date}>
              {format(item.date, "E d MMM", { locale: nl })}
            </ThemedText>
            <ThemedView style={styles.line} />
          </ThemedView>
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
  title: {
    flexDirection: "row",
    gap: theme.spacing(2),
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    marginBottom: 2,
    backgroundColor: theme.colors.dark.greyMedium,
  },
  listItem: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  item: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  date: {
    textTransform: "uppercase",
    fontFamily: theme.font.crimsonPro.semibold.fontFamily,
    color: theme.colors.dark.greyMedium,
  },
}));
