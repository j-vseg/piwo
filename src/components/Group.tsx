import { ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemedView } from "./ThemedView";

export function Group({ children, style }: ViewProps) {
  return <ThemedView style={[styles.Group, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create(() => ({
  Group: {
    borderRadius: 16,
    overflow: "hidden",
  },
}));
