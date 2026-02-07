"use client";

import { getActivities } from "@/services/firebase/activities";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/types/activity";

export default function Home() {
  const {
    data: activities,
    isLoading,
    isError,
    error,
  } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading activities: {String(error)}</div>;
  }

  console.log(activities);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      {activities &&
        activities.map((activity) => (
          <div
            key={activity.id}
            className="w-full max-w-md rounded-2xl p-4 shadow-md mb-4"
          >
            <h2 className="text-xl font-bold">{activity.name}</h2>
            <p className="text-sm text-gray-500">
              {activity.category} |{" "}
              {new Date(activity.startDate).toLocaleDateString()} -{" "}
              {new Date(activity.endDate).toLocaleDateString()}
            </p>

            <div className="mt-2">
              <h3 className="font-semibold">Availabilities:</h3>
              <ul className="ml-4 list-disc">
                {activity.availabilities.map((a, index) => (
                  <li key={index}>
                    {a.key.id} - {a.status} {/* show document ID for now */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
}
