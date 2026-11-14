import { ReactNode } from "react";
import { StyleSheet } from "react-native-unistyles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function Label({
  children,
  required,
  accessible = false,
}: {
  children: ReactNode;
  accessible?: boolean;
  required: boolean;
}) {
  return (
    <ThemedView style={styles.row}>
      <ThemedText
        style={styles.label}
        accessible={accessible}
        {...(!accessible
          ? {
              importantForAccessibility: "no-hide-descendants",
              accessibilityElementsHidden: true,
            }
          : {})}
      >
        {children}
      </ThemedText>
      {required && <ThemedView style={styles.dot} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    marginBottom: theme.spacing(1),
    fontFamily: theme.font.niramit.semibold.fontFamily,
  },
  dot: {
    backgroundColor: theme.colors.primitives.primary,
    borderRadius: theme.borderRadius["full"],
    width: 5,
    height: 5,
    marginTop: 4,
    marginLeft: 2,
  },
}));
