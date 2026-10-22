import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import { ConfirmPassword } from "@/components/ConfirmPassword";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { accountsCollection } from "@/config/firebase";
import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import {
    deleteUserAccount,
    fetchAllAccounts,
} from "@/services/firebase/accounts";
import { getCurrentUser, signOut } from "@/services/firebase/auth";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import { query, where } from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useUnistyles } from "react-native-unistyles";
import { formatAuthRoleFirstNames } from "../util/formatAuthRoleFirstNames";

type DeleteAccountFormData = {
  oldPassword: string;
};

export default function VerifyScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const approval = useAppStore((s) => s.approval);
  const [passwordConfirmOpen, setPasswordConfirmOpen] = useState(false);
  const deleteAccountForm = useForm<DeleteAccountFormData>({
    defaultValues: { oldPassword: "" },
  });
  const { data: authUsers } = useQuery({
    queryKey: ["auth-users"],
    queryFn: () =>
      fetchAllAccounts(
        query(
          accountsCollection,
          where("role", "in", [Role.Advisor, Role.BoardMember]),
        ),
      ),
    staleTime: 30 * 60 * 1000,
  });
  const authUsersNames = formatAuthRoleFirstNames(authUsers);

  const {
    mutate: mutateLogout,
    isPending: isPendingLogout,
    isError: isErrorLogout,
  } = useMutation({
    mutationFn: signOut,
  });

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: async (password: string) => {
      await deleteUserAccount(getCurrentUser()!, password);
    },
  });

  return (
    <>
      <ThemedView
        type="container"
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-evenly",
          marginBottom: rt.insets.bottom,
        }}
      >
        <ThemedView style={{ gap: theme.spacing(4) }}>
          <LottieView
            autoPlay
            loop
            source={require("@/assets/lottie/waiting.json")}
            style={{ width: 300, height: 300, alignSelf: "center" }}
          />

          <ThemedText type="h2">
            {approval === Approval.Unknown
              ? t("verify.titlePending")
              : t("verify.titleDeclined")}
          </ThemedText>

          {isErrorLogout && (
            <Alert
              variant="warning"
              size="regular"
              description={t("verify.logoutError")}
            />
          )}
          {isErrorDelete && (
            <Alert
              variant="warning"
              size="regular"
              description={errorDelete?.message}
            />
          )}

          <ThemedText>
            {approval === Approval.Unknown
              ? t("verify.descriptionPending", { names: authUsersNames })
              : t("verify.descriptionDeclined", { names: authUsersNames })}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ gap: theme.spacing(4) }}>
          <Button
            content={t("verify.logoutButton")}
            accessibilityLabel={t("verify.logoutButton")}
            accessibilityHint={t("verify.logoutHint")}
            onPress={mutateLogout}
            isPending={isPendingLogout}
            disabled={approval === Approval.Declined}
          />
          <Button
            content={t("verify.deleteAccountButton")}
            accessibilityLabel={t("verify.deleteAccountButton")}
            accessibilityHint={t("verify.deleteAccountHint")}
            onPress={() => setPasswordConfirmOpen(true)}
            isPending={isPendingDelete}
            iconLeft="delete"
            buttonStyle={{ backgroundColor: theme.colors.warnings.negative }}
          />
        </ThemedView>
      </ThemedView>

      <ConfirmPassword
        isOpen={passwordConfirmOpen}
        onDismiss={() => setPasswordConfirmOpen(false)}
        onConfirm={() =>
          deleteAccountForm.handleSubmit((data) => {
            mutateDelete(data.oldPassword.trim());
          })()
        }
        control={deleteAccountForm.control as unknown as Control<FieldValues>}
        description={t("settings.deleteAccountDescription")}
      />
    </>
  );
}
