"use client";

import { ErrorIndicator } from "@/components/ErrorIndicator";
import { Event } from "@/components/Event";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { fetchAllOccurrencesGroupedByDate } from "@/services/firebase/events";
import { skipToken, useQuery } from "@tanstack/react-query";
import { format, nextMonday, startOfToday } from "date-fns";
import { nl } from "date-fns/locale";
import { ThisWeek } from "./components/ThisWeek";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";

export default function HomeScreen() {
  const { user } = useAuth();
  const upcomingMonday = useMemo(() => {
    return nextMonday(startOfToday());
  }, []);
  const {
    data: groupedOccurrences,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["occurrences-grouped", upcomingMonday],
    queryFn: user
      ? () => fetchAllOccurrencesGroupedByDate(upcomingMonday)
      : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="flex flex-col flex-1 gap-4 w-full">
      <div className="w-full bg-pastelOrange">
        <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-10 mb-6">
          <h1 className="text-3xl font-bold">Home</h1>
          <ThisWeek />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl p-4 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Toekomstige activiteiten</h2>

          {isLoading ? (
            <LoadingIndicator />
          ) : isError ? (
            <ErrorIndicator>
              Er is iets misgegaan tijdens het ophalen van de geplande
              activiteiten. Probeer het later nog eens.
            </ErrorIndicator>
          ) : !groupedOccurrences ? (
            <p className="py-4 text-center">
              Geen geplande activiteiten beschikbaar
            </p>
          ) : (
            groupedOccurrences.map(({ date, occurrences: dayOccurrences }) => (
              <div
                key={format(date, "yyyy-MM-dd")}
                className="w-full space-y-3"
              >
                {/* Date header */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-500 mr-2 font-poppins uppercase text-[12px]!">
                    {format(date, "E d MMM", { locale: nl })}
                  </h3>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Activities */}
                {dayOccurrences.map((occ) => (
                  <Event key={occ.id} occurrence={occ} />
                ))}
              </div>
            ))
          )}
          {groupedOccurrences && (
            <p className="py-10 text-gray-500 text-center text-[14px]!">
              Meer activiteiten worden zichtbaar bij naderende startdatum
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
