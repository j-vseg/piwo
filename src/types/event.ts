import { Category } from "./category";
import { Recurrence } from "./recurrence";

export interface Event {
  id: string;
  name: string;
  category: Category;

  startDate: Date;
  endDate: Date;

  recurrence?: Recurrence;
}
