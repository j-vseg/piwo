import { ErrorMessage } from "@/components/ErrorMessage";
import Label from "@/components/Label";
import { ThemedView } from "@/components/ThemedView";
import { Role } from "@/constants/Role";
import { Host, Picker } from "@expo/ui";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

type PickerProps<T extends FieldValues> = {
  label: string;
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  userRole: Role;
};

export default function RolePicker<T extends FieldValues>({
  label,
  required = true,
  control,
  name,
  rules,
  userRole,
}: PickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedView style={styles.field}>
          <Label required={required}>{label}</Label>
          <Host
            matchContents={{ vertical: true }}
            style={{ width: "100%", height: 56 }}
          >
            <Picker selectedValue={value} onValueChange={onChange}>
              {Object.values(Role).map((role) => {
                if (role !== userRole) {
                  return <Picker.Item key={role} label={role} value={role} />;
                }
              })}
            </Picker>
          </Host>
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
}));
