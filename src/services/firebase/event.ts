import { addDoc, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { eventsCollection } from "./firebase";
import { Recurrence } from "@/types/recurrence";
import { Category } from "@/types/category";

export async function createEvent(name: string, category: Category, startDate: Date, endDate: Date, recurrence?: Recurrence): Promise<string> {
  const docRef = await addDoc(eventsCollection, {
    name: name,
    category: category,
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
    recurrence: !recurrence || (typeof recurrence === "string" && recurrence.length === 0) ? null : recurrence,
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

export async function deleteEvent(id: string): Promise<void> {
  const docRef = doc(eventsCollection, id);
  await deleteDoc(docRef);
}
