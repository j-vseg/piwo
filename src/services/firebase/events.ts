import { getDocs, collection } from "firebase/firestore";
import { Event } from "@/types/event";
import { Status } from "@/types/status";
import { generateOccurrences } from "@/utils/generateOccurences";
import { EventOccurrence } from "@/types/eventOccurence";
import { db, eventsCollection } from "./firebase";
import { format } from "date-fns";

export async function fetchAllOccurrencesWithAllUsers(): Promise<
  EventOccurrence[]
> {
  const eventsSnapshot = await getDocs(eventsCollection);

  const allOccurrences: EventOccurrence[] = [];

  for (const eventDoc of eventsSnapshot.docs) {
    const eventData = eventDoc.data() as Event;
    const eventId = eventDoc.id;

    const occurrences = generateOccurrences({
      ...eventData,
      id: eventId,
    });

    for (const occ of occurrences) {
      // fetch all user availability
      const availabilitySnapshot = await getDocs(
        collection(db, `eventOccurrences/${occ.id}/availability`),
      );

      const allUserAvailability: Record<string, Status> = {};
      availabilitySnapshot.forEach((doc) => {
        allUserAvailability[doc.id] = doc.data().availability as Status;
      });

      allOccurrences.push({
        ...occ,
        allUserAvailability,
        name: eventData.name,
        category: eventData.category,
      });
    }
  }

  return allOccurrences;
}

type GroupedOccurrences = {
  date: Date;
  occurrences: EventOccurrence[];
}[];

export async function fetchAllOccurrencesGroupedByDate(): Promise<GroupedOccurrences> {
  const eventsSnapshot = await getDocs(eventsCollection);

  const occurrences = eventsSnapshot.docs
    .flatMap((eventDoc) => {
      const eventData = eventDoc.data() as Event;
      const occurrences = generateOccurrences({
        ...eventData,
        id: eventDoc.id,
      });

      return occurrences.map((occ) => ({
        ...occ,
        name: eventData.name,
        category: eventData.category,
      }));
    })
    .sort((a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime());

  // Group by date
  const groups: { [key: string]: EventOccurrence[] } = {};
  
  occurrences.forEach((occ) => {
    const dateKey = format(occ.startTime.toDate(), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(occ);
  });
  
  return Object.entries(groups).map(([dateKey, occs]) => ({
    date: new Date(dateKey),
    occurrences: occs
  }));
}
