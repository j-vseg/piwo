import { EventOccurrence } from "@/types/eventOccurence";
import { Event } from "@/types/event";
import { Timestamp } from "firebase/firestore";
import { Frequency } from "@/types/frequency";

export function generateOccurrences(
  event: Event,
  until: Date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  maxOccurrences: number = 10,
): EventOccurrence[] {
  const occurrences: EventOccurrence[] = [];
  const now = new Date();

  if (!event.recurrence) {
    const eventStart = event.startDate.toDate();
    if (eventStart > now) {
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
  const durationMs = event.endDate.toDate().getTime() - event.startDate.toDate().getTime();
  
  const eventStart = event.startDate.toDate();
  let current = new Date(Math.max(eventStart.getTime(), now.getTime()));
  
  if (eventStart < now) {
    current = findNextOccurrence(eventStart, now, frequency, step);
  }

  let count = 0;

  while (current <= until && count < maxOccurrences) {
    const occurrenceStart = new Date(current);
    const occurrenceEnd = new Date(occurrenceStart.getTime() + durationMs);

    occurrences.push({
      id: `${event.id}-${occurrenceStart.toISOString()}`,
      eventId: event.id,
      startTime: Timestamp.fromDate(occurrenceStart),
      endTime: Timestamp.fromDate(occurrenceEnd),
    });

    current = getNextOccurrence(current, frequency, step);
    count++;
  }

  return occurrences;
}

function getNextOccurrence(currentDate: Date, frequency: Frequency, step: number): Date {
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
    
    // Find the last day of the target month
    const lastDayOfTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
    const actualDay = Math.min(originalDay, lastDayOfTargetMonth);
    
    return new Date(
      targetYear,
      normalizedMonth,
      actualDay,
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
      currentDate.getMilliseconds()
    );
  }
  
  return currentDate;
}

function findNextOccurrence(
  eventStart: Date,
  currentDate: Date,
  frequency: Frequency,
  step: number
): Date {
  let current = new Date(eventStart);
  
  // Keep advancing until we find the first occurrence after currentDate
  while (current <= currentDate) {
    current = getNextOccurrence(current, frequency, step);
  }
  
  return current;
}