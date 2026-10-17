import { Category } from "@/constants/Category";
import { AVAILABILITY_SELECTOR_STATUSES, Status } from "@/constants/Status";
import { useAvailabilityPresentButtonHandlers } from "@/hooks/useAvailabilityPresentButtonHandlers";
import { useEventColor } from "@/hooks/useEventColor";
import { getCurrentUser } from "@/services/firebase/auth";
import {
  getUserAvailability,
  setUserAvailability,
} from "@/services/firebase/availability";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ErrorMessage } from "./ErrorMessage";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface AvailabilitySelectorProps {
  occurrenceId: string;
  occurrenceCategory?: Category;
}

export function AvailabilitySelector({
  occurrenceId,
  occurrenceCategory,
}: AvailabilitySelectorProps) {
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

  const { onClick: presentClick } = useAvailabilityPresentButtonHandlers(
    availability ?? undefined,
    updateMutate,
  );

  if (updateIsPending) {
    return <LoadingIndicator />;
  }

  if (updateIsError) {
    return (
      <ErrorMessage>Het updaten van je aanwezigheid is mislukt</ErrorMessage>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {AVAILABILITY_SELECTOR_STATUSES.map((statusOption) => {
        return (
          <Pressable
            key={statusOption}
            style={[
              styles.button(statusOption, availability),
              availability !== statusOption && { backgroundColor: eventColor },
            ]}
            onPress={
              statusOption === Status.Present
                ? presentClick
                : () => updateMutate(statusOption)
            }
          >
            <ThemedText type="button" style={styles.text}>
              {statusOption}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    gap: theme.spacing(2),
    justifyContent: "space-between",
  },
  button: (statusOption: Status, availability?: Status | null) => ({
    borderRadius: 8,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1),
    ...(availability === statusOption && {
      backgroundColor:
        availability === Status.Present || availability === Status.Later
          ? theme.colors.warnings.positive
          : availability === Status.Maybe
            ? theme.colors.warnings.warning
            : availability === Status.Absent
              ? theme.colors.warnings.negative
              : undefined,
    }),
  }),
  text: {
    fontFamily: theme.font.inter.regular.fontFamily,
    fontWeight: theme.font.inter.regular.fontWeight,
    fontSize: 16 as const,
  },
}));
