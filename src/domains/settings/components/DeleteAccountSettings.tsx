import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { OS } from "@/constants/Os";
import { deleteUserAccount } from "@/services/firebase/accounts";
import { getCurrentUser } from "@/services/firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ConfirmPassword } from "../../../components/ConfirmPassword";

type DeleteAccountFormData = {
  oldPassword: string;
};

export function DeleteAccountSettings() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const [isOpen, setIsOpen] = useState(false);

  const user = getCurrentUser();
  const form = useForm<DeleteAccountFormData>({
    defaultValues: { oldPassword: "" },
  });

  const {
    mutate: mutateDelete,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async (password: string) => {
      await deleteUserAccount(user!, password);
    },
    onSuccess: () => setIsOpen(false),
  });

  const handleConfirm = () => {
    form.handleSubmit((data) => {
      mutateDelete(data.oldPassword.trim());
    })();
  };

  return (
    <>
      <ListTile
        title={t("settings.deleteAccount")}
        subtitle={isError ? t("settings.deleteAccountError") : undefined}
        onPress={() => setIsOpen(true)}
        textStyle={{ color: theme.colors.warnings.negative }}
        iconRight={
          isPending ? (
            <LoadingIndicator />
          ) : isError ? (
            "warning"
          ) : Platform.OS === OS.Web ? (
            ("chevron-right" as any)
          ) : (
            "chevron_forward"
          )
        }
        disabled={isPending}
      />
      <ConfirmPassword
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        control={form.control as unknown as Control<FieldValues>}
        description={t("settings.deleteAccountDescription")}
      />
    </>
  );
}
