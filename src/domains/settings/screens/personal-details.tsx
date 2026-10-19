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
import { useEffect, useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";
import { ConfirmPassword } from "../components/ConfirmPassword";

type NameFormData = {
  firstname: string;
  lastname: string;
};

type EmailFormData = {
  email: string;
  oldPassword: string;
};

type PasswordFormData = {
  newPassword: string;
  oldPassword: string;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const user = getCurrentUser();
  const { data: account } = useQuery({
    queryKey: ["account", user?.uid],
    queryFn: () => getAccount(user!.uid),
    enabled: !!user,
  });

  const nameForm = useForm<NameFormData>();
  const emailForm = useForm<EmailFormData>();
  const passwordForm = useForm<PasswordFormData>();

  useEffect(() => {
    if (account) {
      nameForm.reset({
        firstname: account.firstName ?? "",
        lastname: account.lastName ?? "",
      });
    }
  }, [account, nameForm]);

  useEffect(() => {
    if (user) {
      emailForm.reset({ email: user.email ?? "", oldPassword: "" });
    }
  }, [user, emailForm]);

  useEffect(() => {
    passwordForm.reset({ newPassword: "", oldPassword: "" });
  }, [passwordForm]);

  const {
    mutate: mutateName,
    isPending: isPendingName,
    isSuccess: isSuccessName,
    isError: isErrorName,
  } = useMutation({
    mutationFn: async (data: NameFormData) => {
      await updateAccountProfile(user!.uid, {
        firstName: data.firstname.trim(),
        lastName: data.lastname.trim(),
      });
      nameForm.reset(data);
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
    mutationFn: async (data: { email: string; oldPassword: string }) => {
      await updateUserEmail(user!, data.oldPassword, data.email);
      emailForm.reset({ email: user?.email ?? "", oldPassword: "" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const {
    mutate: mutatePassword,
    isPending: isPendingPassword,
    isSuccess: isSuccessPassword,
    error: errorPassword,
  } = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      await updateUserPassword(user!, data.oldPassword, data.newPassword);
      passwordForm.reset({ newPassword: "", oldPassword: "" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [confirmPasswordFor, setConfirmPasswordFor] = useState<
    "password" | "email" | null
  >(null);

  const handleConfirm = () => {
    if (confirmPasswordFor === "password") {
      passwordForm.handleSubmit((data) => {
        mutatePassword({
          oldPassword: data.oldPassword.trim(),
          newPassword: data.newPassword.trim(),
        });
        setConfirmPasswordFor(null);
      })();
    } else if (confirmPasswordFor === "email") {
      emailForm.handleSubmit((data) => {
        mutateEmail({
          email: data.email.trim(),
          oldPassword: data.oldPassword.trim(),
        });
        setConfirmPasswordFor(null);
      })();
    }
  };

  return (
    <>
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
                disabled={!nameForm.formState.isDirty}
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
                disabled={!emailForm.formState.isDirty}
                onPress={emailForm.handleSubmit(() =>
                  setConfirmPasswordFor("email"),
                )}
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
              {errorPassword && (
                <Alert
                  variant="warning"
                  size="regular"
                  description={errorPassword.message}
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
                disabled={!passwordForm.formState.isDirty}
                onPress={passwordForm.handleSubmit(() =>
                  setConfirmPasswordFor("password"),
                )}
                accessibilityLabel={t("personalDetails.savePasswordButton")}
                accessibilityHint={t("personalDetails.savePasswordHint")}
              />
            </ThemedView>
          </Accordion>
        </Group>
      </ThemedView>

      <ConfirmPassword
        isOpen={confirmPasswordFor !== null}
        onDismiss={() => setConfirmPasswordFor(null)}
        onConfirm={handleConfirm}
        control={
          (confirmPasswordFor === "email"
            ? emailForm.control
            : passwordForm.control) as unknown as Control<FieldValues>
        }
        description={t("personalDetails.currentPasswordDescription")}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
}));
