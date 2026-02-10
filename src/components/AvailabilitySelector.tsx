import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserAvailability } from "@/services/firebase/availability";
import { Status } from "@/types/status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
    mutationFn: (status?: Status) =>
      setUserAvailability(occurrenceId, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occurrences"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="flex justify-between">
      {Object.values(Status).map((statusOption) => (
        <button
          key={statusOption}
          onClick={() => mutation.mutate(statusOption)}
          className={`px-3 py-1 rounded-lg ${
            currentStatus === statusOption
              ? currentStatus === Status.Absent
                ? "bg-error"
                : currentStatus === Status.Maybe
                  ? "bg-danger"
                  : "bg-success"
              : "bg-background-200"
          }`}
          disabled={mutation.isPending}
        >
          <p className="text-[14px]!">{statusOption}</p>
        </button>
      ))}
      <button
        className="px-2 py-1 rounded-full bg-background-200"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(undefined)}
      >
        <FontAwesomeIcon icon={faTrash} size="xs" />
      </button>
    </div>
  );
}
