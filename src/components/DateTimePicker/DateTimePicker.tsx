import NativeDateTimePicker from "@expo/ui/community/datetime-picker";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";
import { ErrorMessage } from "../ErrorMessage";
import Label from "../Label";
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

export default function DateTimePicker<T extends FieldValues>({
  label,
  required = true,
  control,
  name,
  rules,
  mode = "datetime-local",
  disabled = false,
}: DateTimePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const dateValue = value as unknown as Date | undefined;
        return (
          <ThemedView style={styles.field}>
            <Label>
              {label}
              {required && <ThemedView style={styles.dot} />}
            </Label>
            <NativeDateTimePicker
              value={dateValue instanceof Date ? dateValue : new Date()}
              onValueChange={(_event: unknown, selectedDate: Date) => {
                onChange(selectedDate);
              }}
              mode={mode === "datetime-local" ? "date" : mode}
              disabled={disabled}
            />
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
  dot: {
    backgroundColor: theme.colors.primitives.primary,
    borderRadius: 99,
    width: 5,
    height: 5,
    marginBottom: 8,
    marginLeft: 2,
  },
}));
