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
  option: (selected: boolean) => ({
    borderRadius: theme.spacing(2),
    paddingHorizontal: theme.spacing(5),
    paddingVertical: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: selected
      ? theme.colors.primitives.tertairy
      : theme.colors.primitives.quinary,
  }),
  optionText: (selected: boolean) => ({
    fontFamily: theme.text.bodyMedium.fontFamily,
    fontWeight: theme.text.bodyMedium.fontWeight,
    fontSize: theme.text.bodySmall.fontSize,
    color: selected ? theme.colors.light.white : theme.colors.dark.black,
  }),
}));
