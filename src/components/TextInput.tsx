import {
  TextInput as ExpoUITextInput,
  type TextInputProps as ExpoUITextInputProps,
  Host,
} from "@expo/ui";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";
import { ErrorMessage } from "./ErrorMessage";
import { ThemedView } from "./ThemedView";

type TextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  inputProps?: Omit<
    ExpoUITextInputProps,
    "value" | "defaultValue" | "onChangeText"
  >;
};

export default function TextInput<T extends FieldValues>({
  control,
  name,
  rules,
  inputProps,
}: TextInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedView style={styles.input}>
          <Host matchContents={{ vertical: true }} style={{ width: "100%" }}>
            <ExpoUITextInput
              defaultValue={value}
              onChangeText={onChange}
              {...inputProps}
            />
          </Host>
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
  textInput: {
    fontFamily: "Poppins",
    fontSize: 16,
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.colors.dark.greyLight,
    color: theme.colors.dark.black,
  },
}));
