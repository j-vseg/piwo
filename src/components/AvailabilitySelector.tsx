import { Category } from "@/constants/Category";
import { Status } from "@/constants/Status";
import { getCurrentUser } from "@/services/firebase/auth";
import {
  getUserAvailability,
  setUserAvailability,
} from "@/services/firebase/availability";
import { useTranslation } from "@/translations/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "./Alert";
import LoadingIndicator from "./LoadingIndicator";
import { StatusButtonGroup } from "./StatusButtonGroup";

interface AvailabilitySelectorProps {
  occurrenceId: string;
  category?: Category;
}

export function AvailabilitySelector({
  occurrenceId,
  category,
}: AvailabilitySelectorProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = getCurrentUser();
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
        queryKey: ["has-entered-weekly-availability"],
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
    return <LoadingIndicator />;
  }

  if (updateIsError) {
    return (
      <Alert
        description={t("activity.errorUpdateAvailability")}
        variant="warning"
        size="regular"
      />
    );
  }

  return (
    <StatusButtonGroup
      selected={availability}
      category={category}
      onSelect={(status) => updateMutate(status)}
    />
  );
}
