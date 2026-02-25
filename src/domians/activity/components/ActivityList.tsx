import { ErrorIndicator } from "@/components/ErrorIndicator";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import { fetchAllEvents } from "@/services/firebase/events";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Event } from "@/types/event";
import { Card } from "./Card";
import { DisplayTime } from "./DisplayTime";

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
        <>
          {selected ? (
            <div key={`${selected.id}-card`}>
              <Card selected={selected} setSelected={setSelected} />
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[58vh]">
              <h3 className="ml-2">Activiteiten</h3>
              <div className="overflow-y-auto">
                <div className="rounded-2xl overflow-hidden">
                  {events.map((event) => (
                    <div key={event.id}>
                      <div
                        key={`${event.id}-compact`}
                        className="flex flex-col gap-1 p-3 pt-2 w-full bg-white border-b-2 border-gray-200"
                        onClick={() => setSelected(event as Event)}
                      >
                        <h3 className="font-semibold">{event.name}</h3>
                        <DisplayTime
                          startTime={event.startDate.toDate()}
                          endTime={event.startDate.toDate()}
                          recurrence={event.recurrence}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}