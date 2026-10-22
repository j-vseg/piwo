import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
  const { theme, rt } = useUnistyles();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const dateValue = value as unknown as Date | undefined;
        return (
          <ThemedView style={styles.field}>
            <Label required={required}>{label}</Label>
            <input
              type={mode}
              value={
                dateValue instanceof Date
                  ? toLocalDateTimeString(dateValue)
                  : String(value ?? "")
              }
              onChange={(e) => {
                const parsed = new Date(e.target.value);
                if (!isNaN(parsed.getTime())) {
                  onChange(parsed);
                }
              }}
              disabled={disabled}
              style={{
                fontFamily: theme.text.bodyMedium.fontFamily,
                fontWeight: theme.text.bodyMedium.fontWeight,
                fontSize: theme.text.bodyMedium.fontSize,
                color: theme.text.text.color,
                padding: theme.spacing(3),
                borderRadius: theme.spacing(2),
                backgroundColor: theme.colors.primitives.quinary,
                border: "none",
                outline: "none",
                colorScheme: rt.themeName,
              }}
            />
            {error?.message && <ErrorMessage>{error.message}</ErrorMessage>}
          </ThemedView>
        );
      }}
    />
  );
}

function toLocalDateTimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.spacing(1),
  },
}));
