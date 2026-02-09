import { EventOccurrence } from "@/types/eventOccurence";
import { Event } from "@/types/event";
import { Timestamp } from "firebase/firestore";
import { Frequency } from "@/types/frequency";

export function generateOccurrences(
  event: Event,
  until: Date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  maxOccurrences: number = 50,
): EventOccurrence[] {
  const occurrences: EventOccurrence[] = [];

  if (!event.recurrence) {
    occurrences.push({
      id: event.id,
      eventId: event.id,
      startTime: event.startDate,
      endTime: event.endDate,
    });
    return occurrences;
  }

  const { frequency, interval } = event.recurrence;
  const step = interval ?? 1; // default interval = 1 if undefined

  const durationMs =
    event.endDate.toDate().getTime() - event.startDate.toDate().getTime();
  const current = event.startDate.toDate();
  let count = 0;

  while (current <= until && count < maxOccurrences) {
    const normalized = new Date(current);
    normalized.setMilliseconds(0);

    occurrences.push({
      id: `${event.id}-${current.toISOString()}`,
      eventId: event.id,
      startTime: Timestamp.fromDate(current),
      endTime: Timestamp.fromDate(new Date(current.getTime() + durationMs)),
    });

    if (frequency === Frequency.Daily) {
      current.setDate(current.getDate() + step);
    } else if (frequency === Frequency.Weekly) {
      current.setDate(current.getDate() + 7 * step);
    } else if (frequency === Frequency.Monthly) {
      current.setMonth(current.getMonth() + step);
    }

    count++;
  }

  return occurrences;
}
