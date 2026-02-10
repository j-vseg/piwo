import { EventOccurrence } from "@/types/eventOccurence";
import { Event } from "@/types/event";
import { Timestamp } from "firebase/firestore";
import { Frequency } from "@/types/frequency";

export function generateOccurrences(
  event: Event,
  from: Date = new Date(),
  until: Date = new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000), // 10 weeks
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

  const { frequency, interval } = event.recurrence;
  const step = interval ?? 1;

  const eventStart = event.startDate.toDate();
  const durationMs =
    event.endDate.toDate().getTime() - event.startDate.toDate().getTime();

  // Find first occurrence >= from
  let current =
    eventStart >= from
      ? new Date(eventStart)
      : findNextOccurrence(eventStart, from, frequency, step);

  while (current <= until) {
    const occurrenceStart = new Date(current);
    const occurrenceEnd = new Date(occurrenceStart.getTime() + durationMs);

    occurrences.push({
      id: `${event.id}-${occurrenceStart.toISOString()}`,
      eventId: event.id,
      startTime: Timestamp.fromDate(occurrenceStart),
      endTime: Timestamp.fromDate(occurrenceEnd),
    });

    current = getNextOccurrence(current, frequency, step);
  }

  return occurrences;
}

function getNextOccurrence(
  currentDate: Date,
  frequency: Frequency,
  step: number,
): Date {
  if (frequency === Frequency.Daily) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + step);
    return next;
  }

  if (frequency === Frequency.Weekly) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7 * step);
    return next;
  }

  if (frequency === Frequency.Monthly) {
    const originalDay = currentDate.getDate();
    const targetMonth = currentDate.getMonth() + step;
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
  frequency: Frequency,
  step: number,
): Date {
  let current = new Date(eventStart);

  while (current < from) {
    current = getNextOccurrence(current, frequency, step);
  }

  return current;
}
