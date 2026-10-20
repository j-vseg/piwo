import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ErrorMessage } from "./ErrorMessage";
import Label from "./Label";
import { ThemedView } from "./ThemedView";

type TextInputProps<T extends FieldValues> = {
  label: string;
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  inputProps?: Omit<
    RNTextInputProps,
    "value" | "defaultValue" | "onChangeText"
  >;
};

export default function TextInput<T extends FieldValues>({
  label,
  required = true,
  control,
  name,
  rules,
  inputProps,
}: TextInputProps<T>) {
  const { theme } = useUnistyles();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedView style={styles.input}>
          <Label required={required}>{label}</Label>
          <RNTextInput
            value={value ?? ""}
            onChangeText={onChange}
            style={{
              padding: theme.spacing(3),
              borderRadius: theme.spacing(2),
              backgroundColor: theme.colors.primitives.quinary,
              borderWidth: 0,
              fontFamily: theme.text.bodyMedium.fontFamily,
              fontWeight: String(theme.text.bodyMedium.fontWeight) as "400",
              fontSize: theme.text.bodyMedium.fontSize,
              color: theme.text.text.color,
            }}
            placeholderTextColor={theme.colors.dark.greyMedium}
            {...inputProps}
          />
          {error?.message && <ErrorMessage>{error.message}</ErrorMessage>}
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  input: {
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
