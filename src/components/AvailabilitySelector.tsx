import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUserAvailability,
  setUserAvailability,
} from "@/services/firebase/availability";
import { Status } from "@/types/status";
import { LoadingIndicator } from "./LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import { ErrorIndicator } from "./ErrorIndicator";

interface AvailabilitySelectorProps {
  occurrenceId: string;
}

export function AvailabilitySelector({
  occurrenceId,
}: AvailabilitySelectorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: availability } = useQuery({
    queryKey: ["user-availability", occurrenceId, user?.uid],
    queryFn: user
      ? () => getUserAvailability(occurrenceId, user.uid)
      : skipToken,
  });

  const {
    isPending: updateIsPending,
    isError: updateIsError,
    mutate: updateMutate,
  } = useMutation({
    mutationFn: (status?: Status) =>
      setUserAvailability(occurrenceId, user!.uid, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-availability", occurrenceId, user!.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["has-entered-weekly-availability"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (!user) {
    return <ErrorIndicator type="small">Je bent niet ingelogt</ErrorIndicator>;
  }

  if (updateIsPending) {
    return <LoadingIndicator />;
  }

  if (updateIsError) {
    return (
      <ErrorIndicator type="small">
        Het updaten van je aanwezigheid is mislukt
      </ErrorIndicator>
    );
  }

  return (
    <div className="flex justify-between">
      {Object.values(Status).map((statusOption) => (
        <button
          key={statusOption}
          onClick={() => updateMutate(statusOption)}
          className={`px-3 py-1 rounded-lg ${
            availability === statusOption
              ? availability === Status.Absent
                ? "bg-error"
                : availability === Status.Maybe
                  ? "bg-danger"
                  : "bg-success"
              : "bg-background-200"
          }`}
          disabled={updateIsPending}
        >
          <p>{statusOption}</p>
        </button>
      ))}
    </div>
  );
}
