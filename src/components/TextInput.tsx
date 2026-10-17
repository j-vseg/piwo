import {
  TextInput as ExpoUITextInput,
  type TextInputProps as ExpoUITextInputProps,
  Host,
} from "@expo/ui";
import { useEffect, useRef, useState } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useController,
} from "react-hook-form";
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
    ExpoUITextInputProps,
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
  const { field, fieldState } = useController({ control, name, rules });
  const [resetKey, setResetKey] = useState(0);
  const internalValue = useRef<string>(field.value);

  useEffect(() => {
    if (field.value !== internalValue.current) {
      internalValue.current = field.value;
      setResetKey((k) => k + 1);
    }
  }, [field.value]);

  const handleChange = (text: string) => {
    internalValue.current = text;
    field.onChange(text);
  };

  return (
    <ThemedView style={styles.input}>
      <Label required={required}>{label}</Label>
      <Host matchContents={{ vertical: true }} style={{ width: "100%" }}>
        <ExpoUITextInput
          key={resetKey}
          defaultValue={field.value}
          onChangeText={handleChange}
          style={{
            padding: theme.spacing(3),
            borderRadius: theme.spacing(2),
            backgroundColor: theme.colors.primitives.quinary,
            borderWidth: 0,
          }}
          textStyle={{
            fontFamily: theme.text.bodyMedium.fontFamily,
            fontWeight: String(theme.text.bodyMedium.fontWeight) as "400",
            fontSize: theme.text.bodyMedium.fontSize,
            color: theme.text.text.color,
          }}
          placeholderTextColor={theme.colors.dark.greyMedium}
          {...inputProps}
        />
      </Host>
      {fieldState.error?.message && (
        <ErrorMessage>{fieldState.error.message}</ErrorMessage>
      )}
    </ThemedView>
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
