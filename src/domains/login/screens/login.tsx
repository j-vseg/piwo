import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { signInWithEmail } from "@/services/firebase/auth";
import { requestUserPermission } from "@/services/notifications";
import { OS } from "@/constants/Os";
import { useTranslation } from "@/translations/i18n";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Platform, Pressable } from "react-native";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async (data: LoginForm) =>
      signInWithEmail(data.email, data.password),
    onSuccess: async () => {
      if (Platform.OS === OS.Web) {
        const { requestWebNotificationPermission } = await import(
          "@/services/notifications.web"
        );
        requestWebNotificationPermission();
      } else {
        requestUserPermission();
      }
    },
  });

  return (
    <ThemedView type="container" style={styles.container}>
      <ThemedView style={styles.form}>
        <ThemedText type="h1">{t("tabs.login")}</ThemedText>
        {isSuccess && (
          <Alert
            variant="success"
            size="regular"
            description={t("login.success")}
          />
        )}
        {isError && (
          <Alert
            variant="warning"
            size="regular"
            description={t("login.error")}
          />
        )}

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
          }}
        />

        <ThemedView style={styles.button}>
          <Button
            content={t("login.loginButton")}
            isPending={isPending}
            onPress={handleSubmit((data) => mutate(data))}
            accessibilityLabel={t("login.loginButton")}
            accessibilityHint={t("login.accessibilityHint")}
          />
          <Pressable hitSlop={20} onPress={() => router.push("/sign-up")}>
            <ThemedText
              style={{ textDecorationLine: "underline" }}
              type="bodySmaller"
            >
              {t("login.noAccount")}
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
