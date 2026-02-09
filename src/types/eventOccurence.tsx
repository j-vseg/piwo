import { Timestamp } from "firebase/firestore";
import { Status } from "./status";

export interface EventOccurrence {
  id: string;
  eventId: string;

  startTime: Timestamp;
  endTime: Timestamp;

  allUserAvailability?: Record<string, Status>;

  name?: string;
  category?: string;
}
