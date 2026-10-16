import type { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./themed-view";

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
      <ThemedText type="small">{title}</ThemedText>
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
    borderRadius: theme.gap(2),
    paddingVertical: theme.gap(0.5),
    paddingHorizontal: theme.gap(2),
  },
}));
