import type { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({
  title = "Try editing",
  hint = "app/index.tsx",
}: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="bodySmall">{title}</ThemedText>
      <ThemedView style={styles.codeSnippet}>
        <ThemedText>{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  codeSnippet: {
    borderRadius: theme.spacing(2),
    paddingVertical: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(2),
  },
}));
