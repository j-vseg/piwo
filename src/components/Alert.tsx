import { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { IconName, IconSymbol } from "./IconSymbol/IconSymbol";
import { ThemedText } from "./ThemedText";

export type AlertProps = {
  icon?: IconName;
  variant: "info" | "warning" | "success";
  description: ReactNode;
  size: "regular" | "large";
  hasShadow?: boolean;
};

export function Alert({
  variant,
  description,
  icon = variant === "info"
    ? "info"
    : variant === "warning"
      ? "warning"
      : "check",
  size,
  hasShadow,
}: AlertProps) {
  const { theme } = useUnistyles();

  return (
    <View
      style={styles.container(variant, size, hasShadow)}
      accessibilityRole="alert"
    >
      {!!icon && (
        <View style={styles.icon(variant, size)}>
          <IconSymbol
            name={icon}
            size={size === "large" ? 48 : 24}
            color={theme.colors.dark.black}
          />
        </View>
      )}
      <View style={styles.content(variant, size)}>
        <ThemedText type="bodySmall" style={styles.description(variant, size)}>
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  icon: (variant: AlertProps["variant"], size: AlertProps["size"]) => ({
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ...(size === "large" && { marginTop: -2 }),
  }),
  content: (variant: AlertProps["variant"], size: AlertProps["size"]) => {
    if (size === "large") {
      return { paddingHorizontal: theme.spacing(2), flexShrink: 1 };
    }

    return {
      flexShrink: 1,
    };
  },
  container: (
    variant: AlertProps["variant"],
    size: AlertProps["size"],
    hasShadow: AlertProps["hasShadow"],
  ) => ({
    borderRadius: 16,
    backgroundColor:
      variant === "warning"
        ? theme.colors.warnings.background.error
        : variant === "success"
          ? theme.colors.warnings.background.success
          : theme.colors.warnings.background.neutral,
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(size === "large" ? 6 : 3),
    gap: theme.spacing(2),
    flexDirection: size === "large" ? "column" : "row",
    alignItems: size === "large" ? "stretch" : "center",
    ...(hasShadow && {
      boxShadow: `-1px 1px 5px 2px ${theme.colors.dark["black_10"]}`,
    }),
  }),
  description: (variant: AlertProps["variant"], size: AlertProps["size"]) => ({
    textAlign: size === "large" ? "center" : "left",
  }),
}));
