"use client";

import { AvailabilitySelector } from "@/components/AvailabilitySelector";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { fetchAllOccurrencesGroupedByDate } from "@/services/firebase/events";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";

export default function Home() {
  const {
    data: groupedOccurrences,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["occurrences-grouped"],
    queryFn: () => fetchAllOccurrencesGroupedByDate(),
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4 gap-4">
      <h1>Home</h1>
      {isLoading ? (
        <LoadingIndicator />
      ) : isError || !groupedOccurrences ? (
        <ErrorIndicator>
          Er is iets misgegaan tijdens het ophalen van de geplande activiteiten. Probeer het later nog eens.
        </ErrorIndicator>
      ) : (
        groupedOccurrences.map(({ date, occurrences: dayOccurrences }) => (
          <div key={format(date, 'yyyy-MM-dd')} className="w-full max-w-md space-y-3">
            {/* Date header */}
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-500 mr-2 font-poppins uppercase text-[12px]!">
                {format(date, 'd MMM', { locale: nl })}
              </h3>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            {/* Activities for this date */}
            {dayOccurrences.map((occ) => (
              <div
                key={occ.id}
                className="rounded-2xl p-4 bg-background-100"
              >
                <h4 className="font-semibold font-poppins!">{occ.name}</h4>
                <p className="text-sm text-gray-500">
                  {`${format(occ.startTime.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occ.endTime.toDate(), isSameDay(occ.endTime.toDate(), occ.startTime.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
                </p>

                <div className="mt-2">
                  <AvailabilitySelector occurrenceId={occ.id} />
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}