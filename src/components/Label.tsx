import { ReactNode } from "react";
import { StyleSheet } from "react-native-unistyles";
import { ThemedText } from "./ThemedText";

export default function Label({
  children,
  accessible = false,
}: {
  children: ReactNode;
  accessible?: boolean;
}) {
  return (
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
  );
}

const styles = StyleSheet.create((theme) => ({
  label: {
    marginBottom: theme.spacing(1),
    fontFamily: theme.font.crimsonPro.semibold.fontFamily,
  },
}));
