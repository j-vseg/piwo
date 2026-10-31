import { Alert } from "@/components/Alert";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { resetPassword } from "@/services/firebase/auth";
import { useTranslation } from "@/translations/i18n";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

type ResetPasswordForm = {
  email: string;
};

export function EmailSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<ResetPasswordForm>();
  const {
    isPending,
    isSuccess,
    isError,
    error,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ email }: { email: string }) => resetPassword(email),
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BottomSheet
      title={t("login.forgotPassword.title")}
      isPresented={open}
      onDismiss={() => {
        resetForm();
        resetMutation();
        setOpen(false);
      }}
    >
      <ThemedView style={styles.container}>
        {isError && (
          <Alert
            variant="warning"
            description={error?.message}
            size={"regular"}
          />
        )}

        {isSuccess && (
          <Alert
            variant="success"
            description={t("login.forgotPassword.success")}
            size={"regular"}
          />
        )}

        <ThemedText>{t("login.forgotPassword.description")}</ThemedText>

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

        <Button
          content={t("login.forgotPassword.button")}
          accessibilityLabel={t("login.forgotPassword.button")}
          accessibilityHint={t("login.forgotPassword.hints.button")}
          isPending={isPending}
          onPress={handleSubmit((data) => mutate({ email: data.email }))}
        />
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(4),
  },
}));
