import { ErrorIndicator } from "@/components/ErrorIndicator";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import { fetchAllEvents } from "@/services/firebase/events";
import { Recurrence } from "@/types/recurrence";
import { getEventColor } from "@/utils/getEventColor";
import { skipToken, useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { Event } from "@/types/event";

export function ActivityList({ selected, setSelected }: { selected: Event | null, setSelected: (event: Event | null) => void }) {
  const { user } = useAuth();
  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useQuery({
    queryKey: ["all-events"],
    queryFn: user ? () => fetchAllEvents() : skipToken,
    staleTime: 30 * 60 * 1000,
  });
    
  return (
    <>
      {isLoadingEvents ? (
        <LoadingIndicator />
      ) : isErrorEvents ? (
        <ErrorIndicator>
          Er is een fout opgetreden bij het ophalen van de activiteiten
        </ErrorIndicator>
      ) : !events ? (
        <ErrorIndicator>
          Er zijn geen activiteiten gevonden om te wijzigen
        </ErrorIndicator>
      ) : (
        <div className="flex gap-4 overflow-x-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`flex flex-col gap-1 p-3 pt-2 rounded-2xl w-max shrink-0 border-5 border-white ${selected?.id === event.id ? `${getEventColor(event.category)}` : "bg-white"}`}
              onClick={() => setSelected(event as Event)}
            >
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-500">
                {event.recurrence &&
                  `${event.recurrence === Recurrence.Daily ? "Elke dag" : "Elke"} ${format(event.startDate.toDate(), `${event.recurrence === Recurrence.Weekly ? "EEEE" : event.recurrence === Recurrence.Monthly ? "do" : ""} HH:mm`, { locale: nl })} - ${format(event.endDate.toDate(), isSameDay(event.endDate.toDate(), event.startDate.toDate()) ? "HH:mm" : "EEEE HH:mm", { locale: nl })}`}
                {!event.recurrence &&
                  `${format(event.startDate.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(event.endDate.toDate(), isSameDay(event.endDate.toDate(), event.startDate.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}