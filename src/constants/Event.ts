import { Timestamp } from "firebase/firestore";
import { Category } from "./Category";
import { Recurrence } from "./Recurrence";

export interface Event {
  id: string;
  name: string;
  category: Category;

  // Base start/end (first occurrence)
  startDate: Timestamp;
  endDate: Timestamp;

  recurrence?: Recurrence;
}
