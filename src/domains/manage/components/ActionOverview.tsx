import { Alert } from "@/components/Alert";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import Picker from "@/components/Picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import { queryClient } from "@/queryClient";
import {
  updateAccountApproval,
  updateAccountRole,
} from "@/services/firebase/accounts";
import { Trans, useTranslation } from "@/translations/i18n";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export type Account = {
  id: string;
  firstName: string;
  lastName: string;
  approval: Approval;
  role: Role;
};

type ActionFormData = {
  role?: Role;
};

export function ActionOverview({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (value: Account | undefined) => void;
  user: Account;
}) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const methods = useForm<ActionFormData>();
  const { isPending, error, mutate } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      updateAccountRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      setOpen(undefined);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    isPending: isRevokePending,
    error: revokeError,
    mutate: revokeMutate,
  } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      await Promise.all([
        updateAccountRole(userId, Role.Lid),
        updateAccountApproval(userId, Approval.Unknown),
      ]);
    },
    onSuccess: () => {
      methods.reset();
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["not-approved-users-number"],
      });
      queryClient.invalidateQueries({
        queryKey: ["not-approved-users"],
      });
      setOpen(undefined);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BottomSheet
      title={`${user.firstName} ${user.lastName}`}
      isPresented={open}
      onDismiss={() => setOpen(undefined)}
    >
      <ThemedView style={styles.container}>
        {error && (
          <Alert
            variant="warning"
            description={error?.message}
            size={"regular"}
          />
        )}

        {revokeError && (
          <Alert
            variant="warning"
            description={revokeError?.message}
            size={"regular"}
          />
        )}

        <ThemedText>
          <Trans
            i18nKey="bestuur.manageUsers.accountOverview.currentRole"
            values={{ name: user.firstName, role: user.role }}
            components={{ bold: <ThemedText weight="bold" /> }}
          />
        </ThemedText>

        <ThemedView style={{ gap: theme.spacing(4) }}>
          <Picker
            label={t("bestuur.manageUsers.accountOverview.roleLabel")}
            control={methods.control}
            name="role"
            required={false}
            options={Object.values(Role).filter((r) => r !== user.role)}
          />

          <Button
            content={t("bestuur.manageUsers.accountOverview.saveButton")}
            accessibilityLabel={t(
              "bestuur.manageUsers.accountOverview.saveLabel",
            )}
            accessibilityHint={t(
              "bestuur.manageUsers.accountOverview.saveHint",
            )}
            isPending={isPending}
            disabled={!methods.formState.isDirty}
            iconLeft="edit"
            onPress={methods.handleSubmit((data) =>
              mutate({ userId: user.id, role: data.role! }),
            )}
          />
        </ThemedView>

        <Button
          content={t("bestuur.manageUsers.accountOverview.revokeButton")}
          accessibilityLabel={t(
            "bestuur.manageUsers.accountOverview.revokeLabel",
          )}
          accessibilityHint={t(
            "bestuur.manageUsers.accountOverview.revokeHint",
          )}
          isPending={isRevokePending}
          iconLeft="close"
          onPress={() => revokeMutate({ userId: user.id })}
          type="error"
        />
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(8),
    flexDirection: "column",
  },
}));
