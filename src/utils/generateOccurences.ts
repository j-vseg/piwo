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

  // Non-recurring event
  if (!event.recurrence) {
    const eventStart = event.startDate.toDate();

    if (eventStart >= from && eventStart <= until) {
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
  const eventStart = event.startDate.toDate();
  const durationMs =
    event.endDate.toDate().getTime() - event.startDate.toDate().getTime();

  // Find first occurrence >= from
  let current =
    eventStart >= from
      ? new Date(eventStart)
      : findNextOccurrence(eventStart, from, recurrence);

  while (current <= until) {
    const occurrenceStart = new Date(current);
    const occurrenceEnd = new Date(occurrenceStart.getTime() + durationMs);

    occurrences.push({
      id: `${event.id}-${occurrenceStart.toISOString()}`,
      eventId: event.id,
      startTime: Timestamp.fromDate(occurrenceStart),
      endTime: Timestamp.fromDate(occurrenceEnd),
    });

    current = getNextOccurrence(current, recurrence);
  }

  return occurrences;
}

function getNextOccurrence(currentDate: Date, recurrence: Recurrence): Date {
  if (recurrence === Recurrence.Daily) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    return next;
  }

  if (recurrence === Recurrence.Weekly) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    return next;
  }

  if (recurrence === Recurrence.Monthly) {
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

    return new Date(
      targetYear,
      normalizedMonth,
      actualDay,
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
      currentDate.getMilliseconds(),
    );
  }

  return currentDate;
}

function findNextOccurrence(
  eventStart: Date,
  from: Date,
  recurrence: Recurrence,
): Date {
  let current = new Date(eventStart);

  while (current < from) {
    current = getNextOccurrence(current, recurrence);
  }

  return current;
}
