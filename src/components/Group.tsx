import { ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemedView } from "./ThemedView";

type GroupProps = ViewProps & {
  hasShadow?: boolean;
};

export function Group({ children, style, hasShadow = true }: GroupProps) {
  return (
    <ThemedView style={[styles.group(hasShadow), style]}>{children}</ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: (hasShadow: boolean) => ({
    borderRadius: theme.borderRadius["lg"],
    overflow: "hidden",
    ...(hasShadow && theme.shadow),
  }),
}));
