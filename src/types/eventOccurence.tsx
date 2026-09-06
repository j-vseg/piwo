import { Status } from "./status";
import { Category } from "./category";

export interface EventOccurrence {
  id: string;
  eventId: string;

  startTime: Date;
  endTime: Date;

  allUserAvailability?: Record<string, Status>;

  name?: string;
  category?: Category;
}
