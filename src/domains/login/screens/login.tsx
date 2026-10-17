import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { signInWithEmail } from "@/services/firebase/auth";
import { useTranslation } from "@/translations/i18n";
import { useMutation } from "@tanstack/react-query";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginForm) =>
      signInWithEmail(data.email, data.password),
  });

  return (
    <ThemedView type="container" style={styles.container}>
      <ThemedView style={styles.form}>
        <ThemedText type="h1">{t("tabs.login")}</ThemedText>

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

        <Button
          content={t("login.loginButton")}
          isPending={isPending}
          onPress={handleSubmit((data) => mutate(data))}
          accessibilityLabel={t("login.loginButton")}
          accessibilityHint={t("login.accessibilityHint")}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: theme.colors.primitives.quinary,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing(6),
    gap: theme.spacing(4),
  },
}));
