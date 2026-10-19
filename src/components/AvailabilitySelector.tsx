import { Category } from "@/constants/Category";
import { Status } from "@/constants/Status";
import { useEventColor } from "@/hooks/useEventColor";
import { getCurrentUser } from "@/services/firebase/auth";
import {
  getUserAvailability,
  setUserAvailability,
} from "@/services/firebase/availability";
import { useTranslation } from "@/translations/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage } from "./ErrorMessage";
import LoadingIndicator from "./LoadingIndicator";
import { StatusButtonGroup } from "./StatusButtonGroup";

interface AvailabilitySelectorProps {
  occurrenceId: string;
  occurrenceCategory?: Category;
}

export function AvailabilitySelector({
  occurrenceId,
  occurrenceCategory,
}: AvailabilitySelectorProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = getCurrentUser();
  const eventColor = useEventColor(occurrenceCategory);

  const { data: availability } = useQuery({
    queryKey: ["user-availability", occurrenceId, user?.uid],
    queryFn: () => getUserAvailability(occurrenceId, user!.uid),
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
        queryKey: ["user-availability", occurrenceId, user?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["has-entered-weekly-availability", user?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrenceAvailability", occurrenceId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (updateIsPending) {
    return <LoadingIndicator type="screen" />;
  }

  if (updateIsError) {
    return (
      <ErrorMessage type="screen">{t("activity.errorUpdateAvailability")}</ErrorMessage>
    );
  }

  return (
    <StatusButtonGroup
      selected={availability}
      eventColor={eventColor}
      onSelect={(status) => updateMutate(status)}
    />
  );
}
