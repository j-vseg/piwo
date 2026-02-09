import { getDocs, collection } from "firebase/firestore";
import { Event } from "@/types/event";
import { Status } from "@/types/status";
import { generateOccurrences } from "@/utils/generateOccurences";
import { EventOccurrence } from "@/types/eventOccurence";
import { db, eventsCollection } from "./firebase";

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
