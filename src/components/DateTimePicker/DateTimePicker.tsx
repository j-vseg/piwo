import NativeDateTimePicker from "@expo/ui/community/datetime-picker";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useRef, useState } from "react";
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
  mode?: "date" | "time" | "datetime-local";
  disabled?: boolean;
};

type PickerStep = "closed" | "date" | "time";

function formatDisplay(date: Date, mode: string) {
  if (mode === "time") return format(date, "HH:mm", { locale: nl });
  if (mode === "datetime-local")
    return format(date, "d MMM yyyy HH:mm", { locale: nl });
  return format(date, "d MMM yyyy", { locale: nl });
}

export default function DateTimePicker<T extends FieldValues>({
  label,
  required = true,
  control,
  name,
  rules,
  mode = "datetime-local",
  disabled = false,
}: DateTimePickerProps<T>) {
  const [step, setStep] = useState<PickerStep>("closed");
  const pendingDate = useRef<Date>(new Date());

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const dateValue = value as unknown as Date | undefined;
        const displayDate = dateValue instanceof Date ? dateValue : new Date();

        const openPicker = () => {
          if (disabled) return;
          pendingDate.current = displayDate;
          setStep(mode === "time" ? "time" : "date");
        };

        const handleDatePicked = (_event: unknown, selectedDate: Date) => {
          pendingDate.current = selectedDate;
          if (mode === "datetime-local") {
            setStep("time");
          } else {
            onChange(selectedDate);
            setStep("closed");
          }
        };

        const handleTimePicked = (_event: unknown, selectedDate: Date) => {
          onChange(selectedDate);
          setStep("closed");
        };

        return (
          <ThemedView style={styles.field}>
            <Label required={required}>{label}</Label>
            <Pressable
              style={styles.trigger}
              onPress={openPicker}
              disabled={disabled}
            >
              <ThemedText>
                {dateValue ? formatDisplay(dateValue, mode) : "Selecteer..."}
              </ThemedText>
            </Pressable>
            {step === "date" && (
              <NativeDateTimePicker
                value={pendingDate.current}
                onValueChange={handleDatePicked}
                onDismiss={() => setStep("closed")}
                mode="date"
              />
            )}
            {step === "time" && (
              <NativeDateTimePicker
                value={pendingDate.current}
                onValueChange={handleTimePicked}
                onDismiss={() => setStep("closed")}
                mode="time"
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
