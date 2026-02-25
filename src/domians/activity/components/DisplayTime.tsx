import { Recurrence } from "@/types/recurrence";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";

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
    recurrence === Recurrence.Weekly || recurrence === Recurrence.Daily
      ? "EEEE HH:mm"
      : recurrence === Recurrence.Monthly
        ? "do HH:mm"
        : "HH:mm";

  const recurrenceText = recurrence && (() => {
    const startFmt = format(startTime, recurrenceDatePattern, { locale: nl });
    const endFmt = format(
      endTime,
      isSameDay(endTime, startTime) ? "HH:mm" : recurrenceDatePattern,
      { locale: nl }
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
        { locale: nl }
      );
      return `${startFmt} - ${endFmt}`;
    })();

  return (
    <p className="text-sm text-gray-500">
      {recurrenceText || oneOffText}
    </p>
  );
}