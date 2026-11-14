import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { Pressable, ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ErrorMessage } from "./ErrorMessage";
import { IconSymbol } from "./IconSymbol/IconSymbol";
import Label from "./Label";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type PickerProps<T extends FieldValues> = {
  label: string;
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  options: string[];
};

export default function Picker<T extends FieldValues>({
  label,
  required = true,
  control,
  name,
  rules,
  options,
}: PickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedView style={styles.field}>
          <Label required={required}>{label}</Label>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.options}
          >
            {!required && (
              <Pressable
                style={styles.option(!value)}
                onPress={() => onChange(undefined)}
              >
                <IconSymbol
                  name="close"
                  color={styles.optionText(!value).color}
                />
              </Pressable>
            )}
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.option(value === option)}
                onPress={() => onChange(option)}
              >
                <ThemedText
                  type="button"
                  style={styles.optionText(value === option)}
                >
                  {option}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
          {error?.message && <ErrorMessage>{error.message}</ErrorMessage>}
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.spacing(1),
  },
  options: {
    flexDirection: "row",
    gap: theme.spacing(2),
  },
  option: (selected: boolean) => {
    const state = selected
      ? theme.button.secondary.active
      : theme.button.secondary.default;
    return {
      borderRadius: theme.borderRadius["lg"],
      paddingHorizontal: theme.spacing(6),
      paddingVertical: theme.spacing(2.5),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: state.backgroundColor,
      borderWidth: 1,
      borderColor: state.borderColor,
      minHeight: 48,
    };
  },
  optionText: (selected: boolean) => ({
    color: selected
      ? theme.button.secondary.active.textColor
      : theme.button.secondary.default.textColor,
  }),
}));
