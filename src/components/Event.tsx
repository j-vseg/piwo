import { nl } from "date-fns/locale";
import { AvailabilitySelector } from "./AvailabilitySelector";
import { EventOccurrence } from "@/types/eventOccurence";
import { format, isSameDay } from "date-fns";

export function Event({ occurrence }: { occurrence: EventOccurrence }) {
  return (
    <div key={occurrence.id} className="rounded-2xl p-4 bg-background-100">
      <h4 className="font-semibold font-poppins!">{occurrence.name}</h4>
      <p className="text-sm text-gray-500">
        {`${format(occurrence.startTime.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occurrence.endTime.toDate(), isSameDay(occurrence.endTime.toDate(), occurrence.startTime.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
      </p>

      <div className="mt-2">
        <AvailabilitySelector occurrenceId={occurrence.id} />
      </div>
    </div>
  );
}
