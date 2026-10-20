import { Alert } from "@/components/Alert";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";
import { Approval } from "@/constants/Approval";
import { queryClient } from "@/queryClient";
import { updateAccountApproval } from "@/services/firebase/accounts";
import { useTranslation } from "@/translations/i18n";
import { useMutation } from "@tanstack/react-query";
import { StyleSheet } from "react-native-unistyles";

export function ApprovalOverview({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: (value: string | undefined) => void;
  userId: string;
}) {
  const { t } = useTranslation();
  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: ({
      userId,
      approval,
    }: {
      userId: string;
      approval: Approval;
    }) => updateAccountApproval(userId, approval),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["not-approved-users-number"],
      });
      queryClient.invalidateQueries({
        queryKey: ["not-approved-users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BottomSheet
      title={t("manage.actionOverview.title")}
      isPresented={open}
      onDismiss={() => setOpen(undefined)}
    >
      {isError && (
        <Alert
          variant="warning"
          description={error?.message}
          size={"regular"}
        />
      )}

      <ThemedView style={styles.container}>
        <Button
          content={t("manage.actionOverview.approveButton")}
          accessibilityLabel={t("manage.actionOverview.approveLabel")}
          accessibilityHint={t("manage.actionOverview.approveHint")}
          isPending={isPending}
          iconLeft="check"
          onPress={() => mutate({ userId, approval: Approval.Accepted })}
          buttonStyle={styles.button(Approval.Accepted)}
        />
        <Button
          content={t("manage.actionOverview.declineButton")}
          accessibilityLabel={t("manage.actionOverview.declineLabel")}
          accessibilityHint={t("manage.actionOverview.declineHint")}
          isPending={isPending}
          iconLeft="close"
          onPress={() => mutate({ userId, approval: Approval.Declined })}
          buttonStyle={styles.button(Approval.Declined)}
        />
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(4),
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: (approval: Approval) => ({
    flex: 1,
    backgroundColor:
      approval === Approval.Accepted
        ? theme.colors.warnings.positive
        : theme.colors.warnings.negative,
    borderColor:
      approval === Approval.Accepted
        ? theme.colors.warnings.positive
        : theme.colors.warnings.negative,
  }),
}));
