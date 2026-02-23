import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { eventsCollection } from "./firebase";
import { Recurrence } from "@/types/recurrence";
import { Category } from "@/types/category";
import { Event } from "@/types/event";
import { generateOccurrences } from "@/utils/generateOccurences";
import { addWeeks, subWeeks } from "date-fns";
import { db } from "./firebase";

export async function createEvent(
  name: string,
  category: Category,
  startDate: Date,
  endDate: Date,
  recurrence?: Recurrence,
): Promise<string> {
  const docRef = await addDoc(eventsCollection, {
    name: name,
    category: category,
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
    recurrence:
      !recurrence || (typeof recurrence === "string" && recurrence.length === 0)
        ? null
        : recurrence,
  });

  return docRef.id;
}

export async function updateEvent(
  id: string,
  name: string,
  category: Category,
  startDate?: Date,
  endDate?: Date,
  recurrence?: Recurrence,
): Promise<void> {
  const docRef = doc(eventsCollection, id);
  const noRecurrence =
    !recurrence || (typeof recurrence === "string" && recurrence.length === 0);

  await updateDoc(docRef, {
    name: name,
    category: category,
    ...(noRecurrence
      ? {
          startDate: startDate ? Timestamp.fromDate(startDate) : undefined,
          endDate: endDate ? Timestamp.fromDate(endDate) : undefined,
        }
      : {}),
  });
}

async function deleteAvailabilityForOccurrence(
  occurrenceId: string,
): Promise<void> {
  const availabilityRef = collection(
    db,
    `eventOccurrences/${occurrenceId}/availability`,
  );
  const snapshot = await getDocs(availabilityRef);
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
}

export async function deleteEvent(id: string): Promise<void> {
  const eventRef = doc(eventsCollection, id);
  const eventSnap = await getDoc(eventRef);
  if (!eventSnap.exists()) return;
  const event = { ...eventSnap.data(), id: eventSnap.id } as Event;

  if (event.recurrence) {
    const from = subWeeks(new Date(), 2);
    const until = addWeeks(new Date(), 10);
    const occurrences = generateOccurrences(event, from, until);
    await Promise.all(
      occurrences.map((occ) => deleteAvailabilityForOccurrence(occ.id)),
    );
  } else {
    await deleteAvailabilityForOccurrence(id);
  }

  await deleteDoc(eventRef);
}
