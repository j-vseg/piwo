import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import { queryClient } from "@/queryClient";
import { createAuthUser, createFirestoreUser } from "@/services/firebase/auth";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import { User } from "@react-native-firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable } from "react-native";

type SignUpForm = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<SignUpForm>();

  const {
    mutate: mutateCreateAuth,
    isPending: isPendingCreateAuth,
    error: errorCreateAuth,
  } = useMutation({
    mutationFn: (data: SignUpForm) =>
      createAuthUser(data.email.trim(), data.password.trim()),
    onSuccess: ({ user }, variables) => {
      mutateCreateFirestore({
        user,
        data: {
          firstname: variables.firstname.trim(),
          lastname: variables.lastname.trim(),
        },
      });
    },
  });

  const {
    mutate: mutateCreateFirestore,
    isSuccess: isSuccessCreateFirestore,
    isPending: isPendingCreateFirestore,
    error: errorCreateFirestore,
  } = useMutation({
    mutationFn: (data: {
      user: User;
      data: {
        firstname: string;
        lastname: string;
      };
    }) =>
      createFirestoreUser(data.user, data.data.firstname, data.data.lastname),
    onSuccess: () => {
      useAppStore.getState().setAccount({
        role: Role.Lid,
        approval: Approval.Unknown,
      });
      queryClient.clear();
    },
  });

  return (
    <ThemedView type="container" style={styles.container}>
      <ThemedView style={styles.form}>
        <ThemedText type="h1">{t("tabs.signUp")}</ThemedText>

        {isSuccessCreateFirestore && (
          <Alert
            variant="success"
            size="regular"
            description={t("login.success")}
          />
        )}
        {(errorCreateAuth || errorCreateFirestore) && (
          <Alert
            variant="warning"
            size="regular"
            description={
              errorCreateAuth?.message ??
              errorCreateFirestore?.message ??
              t("common.unknownError")
            }
          />
        )}

        <TextInput
          label={t("personalDetails.firstnameLabel")}
          control={control}
          name="firstname"
          rules={{ required: t("personalDetails.firstnameRequired") }}
          inputProps={{
            placeholder: t("personalDetails.firstnamePlaceholder"),
          }}
        />
        <TextInput
          label={t("personalDetails.lastnameLabel")}
          control={control}
          name="lastname"
          rules={{ required: t("personalDetails.lastnameRequired") }}
          inputProps={{
            placeholder: t("personalDetails.lastnamePlaceholder"),
          }}
        />
        <TextInput
          label={t("login.emailLabel")}
          control={control}
          name="email"
          rules={{
            required: t("login.emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("login.emailInvalid"),
            },
          }}
          inputProps={{
            placeholder: t("login.emailPlaceholder"),
            autoCapitalize: "none",
            keyboardType: "email-address",
            autoComplete: "email",
          }}
        />
        <TextInput
          label={t("login.passwordLabel")}
          control={control}
          name="password"
          rules={{
            required: t("login.passwordRequired"),
            minLength: {
              value: 8,
              message: t("login.passwordMinLength"),
            },
          }}
          inputProps={{
            placeholder: t("login.passwordPlaceholder"),
            secureTextEntry: true,
            autoComplete: "password",
            autoCorrect: false,
            autoCapitalize: "none",
          }}
        />
        <ThemedView style={styles.button}>
          <Button
            content={t("login.loginButton")}
            isPending={isPendingCreateAuth || isPendingCreateFirestore}
            onPress={handleSubmit((data) => mutateCreateAuth(data))}
            accessibilityLabel={t("signUp.signUpButton")}
            accessibilityHint={t("login.accessibilityHint")}
          />
          <Pressable hitSlop={10} onPress={() => router.push("/")}>
            <ThemedText
              style={{ textDecorationLine: "underline" }}
              type="bodySmaller"
              selectable={false}
            >
              {t("signUp.haveAccount")}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: theme.screen.default.backgroundColor,
    transform: [{ translateY: rt.insets.ime * -1 }],
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing(6),
    gap: theme.spacing(4),
  },
  button: {
    gap: theme.spacing(1),
  },
}));
