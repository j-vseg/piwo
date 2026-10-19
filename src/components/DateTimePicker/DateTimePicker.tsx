import { DateTimePicker as ExpoDateTimePicker } from "@expo/ui/community/datetime-picker";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ErrorMessage } from "../ErrorMessage";
import Label from "../Label";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type DateTimePickerProps<T extends FieldValues> = {
  label: string;
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  mode?: "date" | "time" | "datetime";
  disabled?: boolean;
};

function formatDisplay(date: Date, mode: string) {
  if (mode === "time") return format(date, "HH:mm", { locale: nl });
  if (mode === "datetime")
    return format(date, "d MMM yyyy HH:mm", { locale: nl });
  return format(date, "d MMM yyyy", { locale: nl });
}

export default function DateTimePicker<T extends FieldValues>({
  label,
  required = true,
  control,
  name,
  rules,
  mode = "datetime",
  disabled = false,
}: DateTimePickerProps<T>) {
  const [pickerValue, setPickerValue] = useState<Date | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <ThemedView style={styles.field}>
            <Label required={required}>{label}</Label>
            <Pressable
              style={styles.trigger}
              onPress={() => setPickerValue(value ?? new Date())}
              disabled={disabled}
            >
              <ThemedView>
                <ThemedText>
                  {value ? formatDisplay(value, mode) : "Selecteer..."}
                </ThemedText>
              </ThemedView>
            </Pressable>
            {pickerValue && (
              <ExpoDateTimePicker
                value={value}
                onValueChange={onChange}
                onDismiss={() => setPickerValue(null)}
                mode={mode ?? "date"}
                presentation="dialog"
              />
            )}
            {error?.message && <ErrorMessage>{error.message}</ErrorMessage>}
          </ThemedView>
        );
      }}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.spacing(1),
  },
  trigger: {
    backgroundColor: theme.colors.primitives.quinary,
    borderRadius: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2.5),
  },
}));
