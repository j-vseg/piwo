import { EventOccurrence } from "@/types/eventOccurence";
import { Event } from "@/types/event";
import { Timestamp } from "firebase/firestore";
import { Recurrence } from "@/types/recurrence";
import { addWeeks } from "date-fns";

export function generateOccurrences(
  event: Event,
  from: Date = new Date(),
  until: Date = addWeeks(from, 10),
): EventOccurrence[] {
  const occurrences: EventOccurrence[] = [];
  const eventStart = event.startDate.toDate();
  const eventEnd = event.endDate.toDate();
  const durationMs = eventEnd.getTime() - eventStart.getTime();

  // Non-recurring event
  if (!event.recurrence) {
    if (eventEnd >= from && eventStart <= until) {
      occurrences.push({
        id: event.id,
        eventId: event.id,
        startTime: event.startDate,
        endTime: event.endDate,
      });
    }
    return occurrences;
  }

  const recurrence = event.recurrence;

  // Find first occurrence whose endTime >= from
  let current =
    eventStart >= from
      ? new Date(eventStart)
      : findNextOccurrenceEndingAfter(eventStart, from, recurrence, durationMs);

  while (current <= until) {
    const occurrenceStart = new Date(current);
    const occurrenceEnd = new Date(occurrenceStart.getTime() + durationMs);

    // Include only if it overlaps [from, until]
    if (occurrenceEnd >= from && occurrenceStart <= until) {
      occurrences.push({
        id: `${event.id}-${occurrenceStart.toISOString()}`,
        eventId: event.id,
        startTime: Timestamp.fromDate(occurrenceStart),
        endTime: Timestamp.fromDate(occurrenceEnd),
      });
    }

    current = getNextOccurrence(current, recurrence);
  }

  return occurrences;
}

function getNextOccurrence(currentDate: Date, recurrence: Recurrence): Date {
  const next = new Date(currentDate);

  if (recurrence === Recurrence.Daily) {
    next.setDate(next.getDate() + 1);
  } else if (recurrence === Recurrence.Weekly) {
    next.setDate(next.getDate() + 7);
  } else if (recurrence === Recurrence.Monthly) {
    const originalDay = currentDate.getDate();
    const targetMonth = currentDate.getMonth() + 1;
    const targetYear = currentDate.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = targetMonth % 12;

    const lastDayOfTargetMonth = new Date(
      targetYear,
      normalizedMonth + 1,
      0,
    ).getDate();

    const actualDay = Math.min(originalDay, lastDayOfTargetMonth);

    next.setFullYear(targetYear, normalizedMonth, actualDay);
  }

  return next;
}

function findNextOccurrenceEndingAfter(
  eventStart: Date,
  from: Date,
  recurrence: Recurrence,
  durationMs: number,
): Date {
  let current = new Date(eventStart);

  // Move forward until the end time of the occurrence is after 'from'
  while (current.getTime() + durationMs < from.getTime()) {
    current = getNextOccurrence(current, recurrence);
  }

  return current;
}
