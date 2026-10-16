import { Timestamp } from "firebase/firestore";
import { Category } from "./Category";
import { Status } from "./Status";

export interface EventOccurrence {
  id: string;
  eventId: string;

  startTime: Timestamp;
  endTime: Timestamp;

  allUserAvailability?: Record<string, Status>;

  name?: string;
  category?: Category;
}
