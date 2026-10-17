import { AvailabilitySelector } from "@/components/AvailabilitySelector";
import { Divider } from "@/components/Divider";
import { ErrorMessage } from "@/components/ErrorMessage";
import LoadingIndicator from "@/components/LoadingIndicator";
import { StatusButtonGroup } from "@/components/StatusButtonGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Status } from "@/constants/Status";
import { useEventColor } from "@/hooks/useEventColor";
import { getOccurrenceAvailability } from "@/services/firebase/availability";
import { getOccurrenceById } from "@/services/firebase/events";
import { useTranslation } from "@/translations/i18n";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native-unistyles";

export default function ActivityScreen({ id }: { id: string }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selected, setSelected] = useState(Status.Present);
  const {
    data: occurrence,
    isLoading: isLoadingOccurrence,
    isError: isErrorOccurrence,
  } = useQuery({
    queryKey: ["occurrence", id],
    queryFn: () => getOccurrenceById(id),
  });
  const {
    data: availability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailability,
  } = useQuery({
    queryKey: ["occurrenceAvailability", id],
    queryFn: () => getOccurrenceAvailability(id),
  });
  const eventColor = useEventColor(occurrence?.category);
  const counts = useMemo(() => {
    if (!availability) return undefined;
    return {
      [Status.Present]:
        (availability[Status.Present]?.length ?? 0) +
        (availability[Status.Later]?.length ?? 0),
      [Status.Maybe]: availability[Status.Maybe]?.length ?? 0,
      [Status.Absent]: availability[Status.Absent]?.length ?? 0,
    };
  }, [availability]);

  useEffect(() => {
    if (occurrence) {
      navigation.setOptions({
        title: occurrence.name,
        headerStyle: { backgroundColor: eventColor },
      });
    }
  }, [navigation, occurrence, eventColor]);

  if (isLoadingOccurrence) {
    return <LoadingIndicator />;
  }

  if (isErrorOccurrence || !occurrence) {
    return <ErrorMessage>{t("activity.errorOccurrence")}</ErrorMessage>;
  }

  return (
    <ThemedView type="container">
      <ThemedView style={styles.event}>
        <ThemedView>
          <ThemedText type="bodyLarge">{occurrence.name}</ThemedText>
          <ThemedText
            type="bodySmall"
            style={styles.subtitle}
          >{`${format(occurrence.startTime.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occurrence.endTime.toDate(), isSameDay(occurrence.endTime.toDate(), occurrence.startTime.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}</ThemedText>
        </ThemedView>
        <AvailabilitySelector occurrenceId={occurrence.id} />
      </ThemedView>

      <ThemedView style={styles.availability}>
        <ThemedText type="h2">{t("activity.attendance")}</ThemedText>
        {isLoadingAvailability ? (
          <LoadingIndicator />
        ) : isErrorAvailability ? (
          <ErrorMessage>{t("activity.errorAvailability")}</ErrorMessage>
        ) : (
          <>
            <StatusButtonGroup
              selected={selected}
              eventColor={eventColor}
              disabled={isLoadingAvailability}
              counts={counts}
              onSelect={setSelected}
            />
            <ThemedView style={styles.displayNames}>
              <Divider
                centered
                label={t("activity.total", {
                  count:
                    selected === Status.Present
                      ? (availability?.[Status.Present]?.length ?? 0) +
                        (availability?.[Status.Later]?.length ?? 0)
                      : (availability?.[selected]?.length ?? 0),
                })}
              />
              {!availability || !availability[selected] ? (
                <ErrorMessage>{t("activity.noAvailability")}</ErrorMessage>
              ) : selected === Status.Present ? (
                Array.from(
                  new Set([
                    ...(availability?.[Status.Present] ?? []),
                    ...(availability?.[Status.Later] ?? []),
                  ]),
                )
                  .sort((a, b) => a.localeCompare(b, "nl"))
                  .map((displayName) => (
                    <NameItem
                      key={displayName}
                      name={displayName}
                      status={
                        availability?.[Status.Later]?.includes(displayName)
                          ? Status.Later
                          : undefined
                      }
                    />
                  ))
              ) : (
                availability[selected]?.map((displayName) => (
                  <NameItem key={displayName} name={displayName} />
                ))
              )}
            </ThemedView>
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}

function NameItem({ name, status }: { name: string; status?: Status }) {
  return (
    <ThemedView style={styles.nameItem}>
      <ThemedText>{name}</ThemedText>
      <ThemedText style={styles.status}>{status}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  event: {
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
  availability: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  displayNames: {
    flexDirection: "column",
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  nameItem: {
    backgroundColor: theme.colors.light.white,
    borderRadius: 8,
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(2),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    color: theme.colors.dark.greyMedium,
  },
}));
