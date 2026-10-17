import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Control, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUnistyles } from "react-native-unistyles";

export function ConfirmPassword({
  isOpen,
  onDismiss,
  onConfirm,
  control,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  control: Control<FieldValues>;
}) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <BottomSheet
      title={t("personalDetails.currentPasswordPrompt")}
      isPresented={isOpen}
      onDismiss={onDismiss}
    >
      <ThemedView style={{ gap: theme.spacing(4) }}>
        <ThemedText>
          {t("personalDetails.currentPasswordDescription")}
        </ThemedText>

        <TextInput
          label={t("login.passwordLabel")}
          control={control}
          name="oldPassword"
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

        <Button
          content={t("personalDetails.confirmButton")}
          onPress={onConfirm}
          accessibilityLabel={t("personalDetails.confirmButton")}
          accessibilityHint={t("personalDetails.confirmHint")}
        />
      </ThemedView>
    </BottomSheet>
  );
}
