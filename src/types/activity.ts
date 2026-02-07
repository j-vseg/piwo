import { Availability } from "./availability";
import { Category } from "./category";
import { Recurrence } from "./recurrance";

export interface Activity {
  id: string;
  name: string;
  category: Category;
  startDate: Date;
  endDate: Date;
  recurrence: Recurrence;
  availabilities: Availability[];
}
