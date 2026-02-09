"use client";

import { AvailabilitySelector } from "@/components/AvailabilitySelector";
import { useAuth } from "@/contexts/auth";
import { fetchAllOccurrencesWithAllUsers } from "@/services/firebase/events";
import { EventOccurrence } from "@/types/eventOccurence";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  const {
    data: occurrences,
    isLoading,
    isError,
    error,
  } = useQuery<EventOccurrence[]>({
    queryKey: ["occurrences"],
    queryFn: () => fetchAllOccurrencesWithAllUsers(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading occurrences: {String(error)}</div>;
  if (!user) return <div>You are not logged in...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      {occurrences &&
        occurrences.map((occ) => (
          <div
            key={occ.id}
            className="w-full max-w-md rounded-2xl p-4 shadow-md mb-4"
          >
            <h2 className="text-xl font-bold">{occ.name}</h2>
            <p className="text-sm text-gray-500">
              {occ.startTime.toDate().toLocaleString()} -{" "}
              {occ.endTime.toDate().toLocaleString()}
            </p>

            <div className="mt-2">
              <AvailabilitySelector
                occurrenceId={occ.id}
                userId={user.uid}
                currentStatus={occ.allUserAvailability?.[user.uid] ?? null}
              />
            </div>

            <div className="mt-2">
              <h3 className="font-semibold">Availabilities:</h3>
              {occ.allUserAvailability &&
              Object.keys(occ.allUserAvailability).length > 0 ? (
                <ul className="ml-4 list-disc">
                  {Object.entries(occ.allUserAvailability).map(
                    ([userId, status]) => (
                      <li key={userId}>
                        {userId} - {status}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="ml-4 text-gray-400">No availabilities yet</p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
