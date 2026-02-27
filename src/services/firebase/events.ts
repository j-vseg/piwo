import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { Event } from "@/types/event";
import { generateOccurrences } from "@/utils/generateOccurences";
import { EventOccurrence } from "@/types/eventOccurence";
import { db, eventsCollection } from "./firebase";
import { addWeeks, endOfYesterday, format, subWeeks } from "date-fns";

type GroupedOccurrences = {
  date: Date;
  occurrences: EventOccurrence[];
}[];

export async function fetchAllEvents(): Promise<Event[]> {
  const snapshot = await getDocs(eventsCollection);
  const events = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id }) as Event,
  );
  return events.sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis());
}

export async function fetchAllOccurrencesGroupedByDate(
  from: Date = new Date(),
  until: Date = addWeeks(from, 10),
): Promise<GroupedOccurrences> {
  const queries = [
    // All recurring events (need to generate occurrences within date range)
    getDocs(query(eventsCollection, where("recurrence", "!=", null))),

    // Non-recurring events within date range
    getDocs(
      query(
        eventsCollection,
        where("recurrence", "==", null),
        where("startDate", ">=", Timestamp.fromDate(from)),
        where("endDate", "<=", Timestamp.fromDate(until)),
      ),
    ),
  ];

  const [recurringSnapshot, nonRecurringSnapshot] = await Promise.all(queries);

  // Combine and dedupe events
  const allEventDocs = new Map();
  [...recurringSnapshot.docs, ...nonRecurringSnapshot.docs].forEach((doc) => {
    allEventDocs.set(doc.id, doc);
  });

  const occurrences = Array.from(allEventDocs.values())
    .flatMap((eventDoc) => {
      const eventData = eventDoc.data() as Event;
      const occurrences = generateOccurrences(
        {
          ...eventData,
          id: eventDoc.id,
        },
        from,
        until,
      );

      return occurrences.map((occ) => ({
        ...occ,
        name: eventData.name,
        category: eventData.category,
      }));
    })
    .sort(
      (a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime(),
    );

  // Group by date
  const groups: { [key: string]: EventOccurrence[] } = {};

  occurrences.forEach((occ) => {
    const dateKey = format(occ.startTime.toDate(), "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(occ);
  });

  return Object.entries(groups).map(([dateKey, occs]) => ({
    date: new Date(dateKey),
    occurrences: occs,
  }));
}

export async function fetchAllOccurrences(
  from: Date = new Date(),
  until: Date = addWeeks(from, 10),
): Promise<EventOccurrence[]> {
  const queries = [
    // All recurring events (need to generate occurrences within date range)
    getDocs(query(eventsCollection, where("recurrence", "!=", null))),

    // Non-recurring events within date range
    getDocs(
      query(
        eventsCollection,
        where("recurrence", "==", null),
        where("startDate", ">=", Timestamp.fromDate(from)),
        where("endDate", "<=", Timestamp.fromDate(until)),
      ),
    ),
  ];

  const [recurringSnapshot, nonRecurringSnapshot] = await Promise.all(queries);

  // Combine and dedupe events
  const allEventDocs = new Map();
  [...recurringSnapshot.docs, ...nonRecurringSnapshot.docs].forEach((doc) => {
    allEventDocs.set(doc.id, doc);
  });

  const occurrences = Array.from(allEventDocs.values())
    .flatMap((eventDoc) => {
      const eventData = eventDoc.data() as Event;

      return generateOccurrences(
        {
          ...eventData,
          id: eventDoc.id,
        },
        from,
        until,
      ).map((occ) => ({
        ...occ,
        name: eventData.name,
        category: eventData.category,
      }));
    })
    .sort(
      (a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime(),
    );

  return occurrences;
}

export async function getOccurrenceById(
  occurrenceId: string,
): Promise<EventOccurrence | null> {
  // Parse occurrence ID to extract event ID and start time
  const parts = occurrenceId.split("-");
  const eventId = parts[0];

  // Fetch the base event
  const eventDoc = await getDoc(doc(db, "events", eventId));

  if (!eventDoc.exists()) {
    return null;
  }

  const eventData = { ...eventDoc.data(), id: eventDoc.id } as Event;

  // Non-recurring event (occurrence ID = event ID)
  if (parts.length === 1) {
    return {
      id: occurrenceId,
      eventId: eventData.id,
      startTime: eventData.startDate,
      endTime: eventData.endDate,
      name: eventData.name,
      category: eventData.category,
    };
  }

  // Recurring event - extract start time from occurrence ID
  const startTimeString = parts.slice(1).join("-"); // Handle ISO strings with dashes
  const startTime = new Date(startTimeString);

  // Generate the specific occurrence
  const durationMs =
    eventData.endDate.toDate().getTime() -
    eventData.startDate.toDate().getTime();
  const endTime = new Date(startTime.getTime() + durationMs);

  return {
    id: occurrenceId,
    eventId: eventData.id,
    startTime: Timestamp.fromDate(startTime),
    endTime: Timestamp.fromDate(endTime),
    name: eventData.name,
    category: eventData.category,
  };
}

export async function deletePastEvents(): Promise<void> {
  const now = new Date();
  let eventCount = 0;
  let availabilityCount = 0;

  // Get all recurring events to clean up past availability
  const recurringEventsSnapshot = await getDocs(
    query(eventsCollection, where("recurrence", "!=", null)),
  );

  // Clean up availability for past occurrences of recurring events
  for (const eventDoc of recurringEventsSnapshot.docs) {
    const eventData = eventDoc.data() as Event;
    const event = { ...eventData, id: eventDoc.id };

    // Generate past occurrences
    const pastDate = subWeeks(now, 10);
    const pastOccurrences = generateOccurrences(
      event,
      pastDate,
      endOfYesterday(),
    );

    // Delete availability for each past occurrence
    for (const pastOccurrence of pastOccurrences) {
      const availabilitySnapshot = await getDocs(
        collection(db, `eventOccurrences/${pastOccurrence.id}/availability`),
      );

      // Find availability records that match this past occurrence
      for (const availabilityDoc of availabilitySnapshot.docs) {
        console.log("Found past recurring events availability");
        await deleteDoc(availabilityDoc.ref);
        availabilityCount++;
      }
    }
  }

  // Get all non-recurring events with past end dates
  const pastEventsSnapshot = await getDocs(
    query(
      eventsCollection,
      where("recurrence", "==", null),
      where("endDate", "<", Timestamp.fromDate(now)),
    ),
  );

  // Delete each past non-recurring event and its occurrences
  for (const eventDoc of pastEventsSnapshot.docs) {
    const eventId = eventDoc.id;

    // Delete all availability documents in this occurrence's subcollection
    const availabilitySnapshot = await getDocs(
      collection(db, `eventOccurrences/${eventId}/availability`),
    );

    for (const availabilityDoc of availabilitySnapshot.docs) {
      console.log("Found past non-recurring events availability");
      await deleteDoc(availabilityDoc.ref);
      availabilityCount++;
    }

    // Delete the event itself
    await deleteDoc(eventDoc.ref);
    eventCount++;
  }

  console.log(
    `Deleted ${eventCount} past events and ${availabilityCount} availability records`,
  );
}
