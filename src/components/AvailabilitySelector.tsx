import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserAvailability } from "@/services/firebase/availability";
import { Status } from "@/types/status";

interface AvailabilitySelectorProps {
  occurrenceId: string;
  currentStatus?: Status | null;
  userId: string;
}

export function AvailabilitySelector({
  occurrenceId,
  currentStatus,
  userId,
}: AvailabilitySelectorProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (status: Status) =>
      setUserAvailability(occurrenceId, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occurrences"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="flex space-x-2">
      {Object.values(Status).map((statusOption) => (
        <button
          key={statusOption}
          onClick={() => mutation.mutate(statusOption)}
          className={`px-2 py-1 rounded ${
            currentStatus === statusOption
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          disabled={mutation.isPending}
        >
          {statusOption}
        </button>
      ))}
    </div>
  );
}
