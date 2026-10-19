import { ReactNode, useEffect } from "react";
import { AccessibilityInfo, Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function ErrorMessage({
  type,
  children,
}: {
  type?: "screen";
  children: ReactNode;
}) {
  useEffect(() => {
    if (!children) return;
    const timeout = setTimeout(() => {
      AccessibilityInfo?.announceForAccessibilityWithOptions?.(
        children as string,
        { queue: true },
      );
    }, 100);
    return () => clearTimeout(timeout);
  }, [children]);

  return (
    <ThemedView style={styles.error(type)}>
      <ThemedText type="bodySmaller" style={styles.text}>
        {children}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  error: (type) => ({
    width: "100%",
    minHeight: Platform.select({
      ios:
        rt.fontScale >= 1.9
          ? 70
          : rt.fontScale >= 1.75
            ? 30
            : rt.fontScale >= 1.35
              ? 20
              : 15,
      android: rt.fontScale >= 1.75 ? 35 : 25,
    }),
    backgroundColor:
      type === "screen" ? theme.screen.default.backgroundColor : undefined,
  }),
  text: {
    color: theme.colors.warnings.negative,
    width: "100%",
  },
}));
