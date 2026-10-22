import { OS } from "@/constants/Os";
import { ReactNode } from "react";
import { Platform, Pressable, type TextStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { IconName, IconSymbol } from "./IconSymbol/IconSymbol";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type ListTileProps = {
  title: string;
  subtitle?: string;
  iconLeft?: IconName | ReactNode;
  iconRight?: IconName | ReactNode;
  onPress: () => void;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function ListTile({
  title,
  subtitle,
  iconLeft,
  iconRight = Platform.OS === OS.Web
    ? ("chevron-right" as any)
    : "chevron_forward",
  onPress,
  textStyle,
  disabled,
}: ListTileProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.listTile(disabled)}
      disabled={disabled}
    >
      {iconLeft && (
        <ThemedView
          style={styles.leftContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          {typeof iconLeft === "string" ? (
            <IconSymbol
              size={24}
              name={iconLeft as IconName}
              color={theme.colors.dark["black"]}
              style={{ fontWeight: theme.fontWeight.extraLight }}
            />
          ) : (
            iconLeft
          )}
        </ThemedView>
      )}
      <ThemedView style={styles.textContainer}>
        <ThemedText
          type="bodyMedium"
          style={textStyle}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText
            type="bodySmaller"
            style={textStyle}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            {subtitle}
          </ThemedText>
        )}
      </ThemedView>

      {iconRight && (
        <ThemedView
          style={styles.rightContainer}
          importantForAccessibility="no-hide-descendants"
        >
          {typeof iconRight === "string" ? (
            <IconSymbol
              size={24}
              name={iconRight as IconName}
              color={theme.colors.dark["black"]}
              accessible={false}
            />
          ) : (
            iconRight
          )}
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  listTile: (disabled: boolean | undefined) => ({
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(2),
    minHeight: 56,
    margin: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing(4),
    backgroundColor: disabled
      ? theme.button.primary.disabled.backgroundColor
      : theme.colors.light["white"],
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.colors.dark["greyLight"],
  }),
  leftContainer: {
    backgroundColor: theme.colors.transparent,
    flexDirection: "row",
  },
  rightContainer: {
    backgroundColor: theme.colors.transparent,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
    justifyContent: "center",
    flexDirection: "column",
  },
}));
