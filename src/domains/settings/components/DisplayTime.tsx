import { ThemedText } from "@/components/ThemedText";
import { Recurrence } from "@/constants/Recurrence";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { StyleSheet } from "react-native-unistyles";

export function DisplayTime({
  startTime,
  endTime,
  recurrence,
}: {
  startTime: Date;
  endTime: Date;
  recurrence?: Recurrence;
}) {
  const recurrenceDatePattern =
    recurrence === Recurrence.Weekly
      ? "EEEE HH:mm"
      : recurrence === Recurrence.Monthly
        ? "do HH:mm"
        : "HH:mm";

  const recurrenceText =
    recurrence &&
    (() => {
      if (recurrence === Recurrence.Daily) {
        const startFmt = format(startTime, "HH:mm", { locale: nl });
        const endFmt = isSameDay(endTime, startTime)
          ? format(endTime, "HH:mm", { locale: nl })
          : `volgende dag ${format(endTime, "HH:mm", { locale: nl })}`;
        return `Elke dag ${startFmt} - ${endFmt}`;
      }
      const startFmt = format(startTime, recurrenceDatePattern, { locale: nl });
      const endFmt = format(
        endTime,
        isSameDay(endTime, startTime) ? "HH:mm" : recurrenceDatePattern,
        { locale: nl },
      );
      return `Elke ${startFmt} - ${endFmt}`;
    })();

  const oneOffText =
    !recurrence &&
    (() => {
      const startFmt = format(startTime, "d LLLL HH:mm", { locale: nl });
      const endFmt = format(
        endTime,
        isSameDay(endTime, startTime) ? "HH:mm" : "d LLLL HH:mm",
        { locale: nl },
      );
      return `${startFmt} - ${endFmt}`;
    })();

  return (
    <ThemedText type="bodySmall" style={styles.subtitle}>
      {recurrenceText || oneOffText}
    </ThemedText>
  );
}

const styles = StyleSheet.create((theme) => ({
  subtitle: {
    color: theme.colors.dark.greyMedium,
  },
}));
