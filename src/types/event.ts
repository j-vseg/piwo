import { Timestamp } from "firebase/firestore";
import { Category } from "./category";
import { Recurrence } from "./recurrence";

export interface Event {
  id: string;
  name: string;
  category: Category;

  // Base start/end (first occurrence)
  startDate: Timestamp;
  endDate: Timestamp;

  recurrence?: Recurrence;
}
