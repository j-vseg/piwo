import { lightTheme } from "@/themes/light";
import { ReactNode } from "react";
import { Pressable, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { IconName, IconSymbol } from "./IconSymbol/IconSymbol";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ButtonType = keyof typeof lightTheme.button;

type ButtonProps = {
  content: ReactNode | ((pressed: boolean, textColor: string) => ReactNode);
  accessibilityLabel: string;
  accessibilityHint: string;
  onPress: () => void;
  onLongPress?: () => void;
  type?: ButtonType;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  isPending?: boolean;
  buttonStyle?: ViewStyle;
};

export default function Button({
  content,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  onLongPress,
  type = "primary",
  iconLeft,
  iconRight,
  disabled = false,
  isPending = false,
  buttonStyle,
}: ButtonProps) {
  const isDisabled = isPending || disabled;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isDisabled}
      testID="buttonPressable"
      style={({ pressed }) => [
        styles.buttonStyle,
        styles.button(type, pressed, isDisabled),
        buttonStyle,
      ]}
    >
      {({ pressed }) => {
        const textColor = String(
          styles.text(type, pressed, isDisabled).color,
        );
        return (
          <>
            {iconLeft && (
              <IconSymbol
                size={24}
                name={iconLeft}
                color={styles.iconColor(type, pressed, isDisabled).color}
                style={styles.leftIcon(type)}
              />
            )}
            {isPending ? (
              <LoadingIndicator />
            ) : typeof content === "function" ? (
              content(pressed, textColor)
            ) : typeof content === "string" ? (
              <ThemedText
                type="button"
                style={[styles.textStyle, { color: textColor }]}
              >
                {content}
              </ThemedText>
            ) : (
              <ThemedView style={[styles.textStyle, styles.content]}>
                {content}
              </ThemedView>
            )}
            {iconRight && (
              <IconSymbol
                size={24}
                color={styles.iconColor(type, pressed, isDisabled).color}
                style={styles.rightIcon(type)}
                name={iconRight}
              />
            )}
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  buttonStyle: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius["lg"],
    borderWidth: 1,
    paddingTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(6),
    paddingBottom: theme.spacing(2.5),
    paddingRight: theme.spacing(6),
    minHeight: 52,
    width: "100%",
    justifyContent: "center",
  },
  leftIcon: (type: ButtonType) => ({
    marginRight: type === "tertiary" ? theme.spacing(2) : -24,
  }),
  rightIcon: (type: ButtonType) => ({
    marginLeft: type === "tertiary" ? theme.spacing(2) : -24,
  }),
  textStyle: {
    flex: 1,
    textAlign: "center",
  },
  content: {
    alignItems: "center",
  },
  loading: {
    width: 22,
    height: 22,
  },
  button: (type: ButtonType, pressed: boolean, disabled?: boolean) => {
    const state = disabled
      ? theme.button[type]["disabled"]
      : pressed
        ? theme.button[type]["active"]
        : theme.button[type]["default"];

    const base = {
      backgroundColor: state.backgroundColor,
      borderColor: state.borderColor,
    };

    if (!disabled && "innerShadow" in state) {
      const shadow = state.innerShadow as { color: string; y: number };
      return {
        ...base,
        borderBottomWidth: Math.abs(shadow.y),
        borderBottomColor: shadow.color,
      };
    }

    return base;
  },
  text: (type: ButtonType, pressed: boolean, disabled?: boolean) => ({
    color: disabled
      ? theme.button[type]["disabled"].textColor
      : pressed
        ? theme.button[type]["active"].textColor
        : theme.button[type]["default"].textColor,
    ...(type === "tertiary" && {
      fontWeight: theme.fontWeight.medium,
      flex: 0,
    }),
  }),
  iconColor: (type: ButtonType, pressed: boolean, disabled?: boolean) => ({
    color: disabled
      ? theme.button[type]["disabled"].iconColor
      : pressed
        ? theme.button[type]["active"].iconColor
        : theme.button[type]["default"].iconColor,
  }),
}));
