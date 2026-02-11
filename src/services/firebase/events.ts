import { doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { Event } from "@/types/event";
import { generateOccurrences } from "@/utils/generateOccurences";
import { EventOccurrence } from "@/types/eventOccurence";
import { db, eventsCollection } from "./firebase";
import { format } from "date-fns";

type GroupedOccurrences = {
  date: Date;
  occurrences: EventOccurrence[];
}[];

// TODO: Add wher clause to filter on from and until by no recuurrence and otherwise just fetch the occurence to generate
export async function fetchAllOccurrencesGroupedByDate(
  from?: Date,
  until?: Date,
): Promise<GroupedOccurrences> {
  const eventsSnapshot = await getDocs(eventsCollection);

  const occurrences = eventsSnapshot.docs
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

// TODO: Add wher clause to filter on from and until by no recuurrence and otherwise just fetch the occurence to generate
export async function fetchAllOccurrences(
  from?: Date,
  until?: Date,
): Promise<EventOccurrence[]> {
  const eventsSnapshot = await getDocs(eventsCollection);

  const occurrences = eventsSnapshot.docs
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
  occurrenceId: string
): Promise<EventOccurrence | null> {
  // Parse occurrence ID to extract event ID and start time
  const parts = occurrenceId.split('-');
  const eventId = parts[0];
  
  // Fetch the base event
  const eventDoc = await getDoc(doc(db, 'events', eventId));
  
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
  const startTimeString = parts.slice(1).join('-'); // Handle ISO strings with dashes
  const startTime = new Date(startTimeString);
  
  // Generate the specific occurrence
  const durationMs = eventData.endDate.toDate().getTime() - eventData.startDate.toDate().getTime();
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