import { addDoc, Timestamp } from "firebase/firestore";
import { eventsCollection } from "./firebase";
import { Recurrence } from "@/types/recurrence";
import { Category } from "@/types/category";


export async function createEvent(name: string, category: Category, startDate: Date, endDate: Date, recurrence?: Recurrence): Promise<string> {
  const docRef = await addDoc(eventsCollection, {
    name: name,
    category: category,
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
    ecurrence: recurrence === null || recurrence && recurrence.length === 0 ? null : recurrence ,
  });

  return docRef.id;
}
