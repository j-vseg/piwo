import {
  DatePickerDialog,
  Host,
  TimePickerDialog,
} from "@expo/ui/jetpack-compose";
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
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
  const { theme } = useUnistyles();
  const [dialogStep, setDialogStep] = useState<"date" | "time" | null>(null);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const open = () => {
          setPendingDate(value ?? new Date());
          setDialogStep(mode === "time" ? "time" : "date");
        };

        const dismiss = () => {
          setDialogStep(null);
          setPendingDate(null);
        };

        return (
          <ThemedView style={styles.field}>
            <Label required={required}>{label}</Label>
            <Pressable
              style={styles.trigger}
              onPress={open}
              disabled={disabled}
            >
              <ThemedView>
                <ThemedText>
                  {value ? formatDisplay(value, mode) : "Selecteer..."}
                </ThemedText>
              </ThemedView>
            </Pressable>
            {dialogStep === "date" && (
              <Host>
                <DatePickerDialog
                  initialDate={pendingDate?.toISOString()}
                  onDateSelected={(date) => {
                    if (mode === "datetime") {
                      setPendingDate(date);
                      setDialogStep("time");
                    } else {
                      onChange(date);
                      dismiss();
                    }
                  }}
                  onDismissRequest={dismiss}
                  color={theme.colors.category.groupDark}
                />
              </Host>
            )}
            {dialogStep === "time" && (
              <Host>
                <TimePickerDialog
                  initialDate={pendingDate?.toISOString()}
                  is24Hour
                  onDateSelected={(date) => {
                    onChange(date);
                    dismiss();
                  }}
                  onDismissRequest={dismiss}
                  color={theme.colors.category.groupDark}
                />
              </Host>
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
    borderRadius: theme.borderRadius["lg"],
    padding: theme.spacing(4),
    borderBottomColor: theme.colors.dark["greyDark"],
    backgroundColor: theme.colors.dark["greyLight"],
    color: theme.colors.dark["greyDark"],
    ...theme.text.bodyMedium,
  },
}));
