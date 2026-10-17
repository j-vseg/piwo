import { Accordion } from "@/components/Accordion";
import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import { Group } from "@/components/Group";
import TextInput from "@/components/TextInput";
import { ThemedView } from "@/components/ThemedView";
import { queryClient } from "@/queryClient";
import { getAccount, updateAccountProfile } from "@/services/firebase/accounts";
import {
  getCurrentUser,
  updateUserEmail,
  updateUserPassword,
} from "@/services/firebase/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";

type NameFormData = {
  firstname: string;
  lastname: string;
};

type EmailFormData = {
  email: string;
};

type PasswordFormData = {
  newPassword: string;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const user = getCurrentUser();
  const { data: account } = useQuery({
    queryKey: ["account", user?.uid],
    queryFn: () => getAccount(user!.uid),
    enabled: !!user,
  });

  const nameForm = useForm<NameFormData>({
    defaultValues: {
      firstname: account?.firstName ?? "",
      lastname: account?.lastName ?? "",
    },
  });
  const emailForm = useForm<EmailFormData>({
    defaultValues: { email: user?.email ?? "" },
  });
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: "",
    },
  });

  const {
    mutate: mutateName,
    isPending: isPendingName,
    isSuccess: isSuccessName,
    isError: isErrorName,
  } = useMutation({
    mutationFn: async (data: NameFormData) => {
      await updateAccountProfile(user!.uid, {
        firstName: data.firstname,
        lastName: data.lastname,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["occurrenceAvailability"] });
    },
  });
  const {
    mutate: mutateEmail,
    isPending: isPendingEmail,
    isSuccess: isSuccessEmail,
    isError: isErrorEmail,
  } = useMutation({
    mutationFn: async (data: {
      data: EmailFormData;
      currentPassword: string;
    }) => {
      await updateUserEmail(user!, data.currentPassword, data.data.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
    },
  });
  const {
    mutate: mutatePassword,
    isPending: isPendingPassword,
    isSuccess: isSuccessPassword,
    isError: isErrorPassword,
  } = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await updateUserPassword(user!, data.currentPassword, data.newPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
      passwordForm.reset({ newPassword: "" });
    },
  });
  const handleUpdatePassword = (data: PasswordFormData) => {
    const currentPassword = prompt(t("personalDetails.currentPasswordPrompt"));
    if (currentPassword != null && currentPassword !== "") {
      mutatePassword({ currentPassword, newPassword: data.newPassword });
    }
  };
  const handleUpdateEmail = (data: EmailFormData) => {
    const currentPassword = prompt(t("personalDetails.currentPasswordPrompt"));
    if (currentPassword != null && currentPassword !== "") {
      mutateEmail({ data: { email: data.email }, currentPassword });
    }
  };

  useEffect(() => {
    nameForm.reset({
      firstname: account?.firstName ?? "",
      lastname: account?.lastName ?? "",
    });
    emailForm.reset({ email: user?.email ?? "" });
    passwordForm.reset({ newPassword: "" });
  }, [account, emailForm, nameForm, passwordForm, user?.email]);

  return (
    <ThemedView type="container">
      <Group>
        <Accordion title={t("personalDetails.nameTitle")}>
          <ThemedView style={styles.group}>
            {isSuccessName && (
              <Alert
                variant="success"
                size="regular"
                description={t("personalDetails.saveNameSuccess")}
              />
            )}
            {isErrorName && (
              <Alert
                variant="warning"
                size="regular"
                description={t("personalDetails.saveNameError")}
              />
            )}
            <TextInput
              label={t("personalDetails.firstnameLabel")}
              control={nameForm.control}
              name="firstname"
              rules={{ required: t("personalDetails.firstnameRequired") }}
              inputProps={{
                placeholder: t("personalDetails.firstnamePlaceholder"),
              }}
            />
            <TextInput
              label={t("personalDetails.lastnameLabel")}
              control={nameForm.control}
              name="lastname"
              rules={{ required: t("personalDetails.lastnameRequired") }}
              inputProps={{
                placeholder: t("personalDetails.lastnamePlaceholder"),
              }}
            />
            <Button
              content={t("personalDetails.saveNameButton")}
              isPending={isPendingName}
              onPress={nameForm.handleSubmit((data) => mutateName(data))}
              accessibilityLabel={t("personalDetails.saveNameButton")}
              accessibilityHint={t("personalDetails.saveNameHint")}
            />
          </ThemedView>
        </Accordion>

        <Accordion title={t("personalDetails.emailTitle")}>
          <ThemedView style={styles.group}>
            {isSuccessEmail && (
              <Alert
                variant="success"
                size="regular"
                description={t("personalDetails.saveEmailSuccess")}
              />
            )}
            {isErrorEmail && (
              <Alert
                variant="warning"
                size="regular"
                description={t("personalDetails.saveEmailError")}
              />
            )}
            <TextInput
              label={t("personalDetails.emailLabel")}
              control={emailForm.control}
              name="email"
              rules={{
                required: t("personalDetails.emailRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("personalDetails.emailInvalid"),
                },
              }}
              inputProps={{
                placeholder: t("personalDetails.emailPlaceholder"),
              }}
            />
            <Button
              content={t("personalDetails.saveEmailButton")}
              isPending={isPendingEmail}
              onPress={emailForm.handleSubmit(handleUpdateEmail)}
              accessibilityLabel={t("personalDetails.saveEmailButton")}
              accessibilityHint={t("personalDetails.saveEmailHint")}
            />
          </ThemedView>
        </Accordion>

        <Accordion title={t("personalDetails.passwordTitle")}>
          <ThemedView style={styles.group}>
            {isSuccessPassword && (
              <Alert
                variant="success"
                size="regular"
                description={t("personalDetails.savePasswordSuccess")}
              />
            )}
            {isErrorPassword && (
              <Alert
                variant="warning"
                size="regular"
                description={t("personalDetails.savePasswordError")}
              />
            )}
            <TextInput
              label={t("personalDetails.newPasswordLabel")}
              control={passwordForm.control}
              name="newPassword"
              rules={{
                required: t("personalDetails.newPasswordRequired"),
                minLength: {
                  value: 8,
                  message: t("personalDetails.newPasswordMinLength"),
                },
              }}
              inputProps={{
                placeholder: t("personalDetails.newPasswordPlaceholder"),
                secureTextEntry: true,
              }}
            />
            <Button
              content={t("personalDetails.savePasswordButton")}
              isPending={isPendingPassword}
              onPress={passwordForm.handleSubmit(handleUpdatePassword)}
              accessibilityLabel={t("personalDetails.savePasswordButton")}
              accessibilityHint={t("personalDetails.savePasswordHint")}
            />
          </ThemedView>
        </Accordion>
      </Group>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
}));
