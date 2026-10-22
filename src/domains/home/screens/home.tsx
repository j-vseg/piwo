import { useMemo } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Alert } from "@/components/Alert";
import { Divider } from "@/components/Divider";
import Event from "@/components/Event";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { fetchAllOccurrencesGroupedByDate } from "@/services/firebase/events";
import { useTranslation } from "@/translations/i18n";
import { useQuery } from "@tanstack/react-query";
import { format, nextMonday, startOfToday } from "date-fns";
import { nl } from "date-fns/locale";
import { Platform } from "react-native";
import ThisWeek from "../components/ThisWeek";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
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
    <ThemedView
      type="container"
      style={{
        gap: theme.spacing(10),
        paddingTop:
          Platform.OS === OS.Web
            ? rt.insets.top + theme.spacing(6)
            : rt.insets.top + theme.spacing(4),
      }}
    >
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
        {!groupedOccurrences ||
          (groupedOccurrences && groupedOccurrences.length === 0 && (
            <Alert
              variant="info"
              description={t("home.noUpcomingActivities")}
              size={"regular"}
            />
          ))}
        {groupedOccurrences?.map((item) => (
          <ThemedView key={item.date.toDateString()} style={styles.listItem}>
            <Divider label={format(item.date, "E d MMM", { locale: nl })} />
            {item.occurrences.map((occurrence) => (
              <Event key={occurrence.id} occurrence={occurrence} />
            ))}
          </ThemedView>
        ))}
        {groupedOccurrences && groupedOccurrences.length !== 0 && (
          <ThemedText style={styles.info}>{t("home.moreIncoming")}</ThemedText>
        )}
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
  info: {
    marginVertical: theme.spacing(12),
    textAlign: "center",
    color: theme.colors.dark.greyMedium,
    fontFamily: theme.font.crimsonPro.semibold.fontFamily,
  },
}));
