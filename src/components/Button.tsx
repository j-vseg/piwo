import { ReactNode } from "react";
import { Pressable, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { IconName, IconSymbol } from "./IconSymbol/IconSymbol";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type ButtonType = "primary" | "secondary";

type ButtonProps = {
  content: ReactNode;
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
      {({ pressed }) => (
        <>
          {iconLeft && (
            <IconSymbol
              size={24}
              name={iconLeft}
              style={styles.leftIcon}
              color={styles.iconColor(type, pressed, isDisabled).color}
            />
          )}
          {isPending ? (
            <LoadingIndicator />
          ) : typeof content === "string" ? (
            <ThemedText
              type="button"
              style={[styles.textStyle, styles.text(type, pressed, isDisabled)]}
            >
              {content}
            </ThemedText>
          ) : (
            <ThemedView style={[styles.textStyle, { alignItems: "center" }]}>
              {content}
            </ThemedView>
          )}
          {iconRight && (
            <IconSymbol
              size={24}
              style={styles.rightIcon}
              name={iconRight}
              color={styles.iconColor(type, pressed, isDisabled).color}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  buttonStyle: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 80,
    borderWidth: 1,
    paddingTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(6),
    paddingBottom: theme.spacing(2.5),
    paddingRight: theme.spacing(6),
    minHeight: 48,
    width: "100%",
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: -24,
  },
  rightIcon: {
    marginLeft: -24,
  },
  textStyle: {
    flex: 1,
    textAlign: "center",
  },
  button: (type: ButtonType, pressed: boolean, disabled?: boolean) => ({
    backgroundColor: disabled
      ? theme.button[type].disabled.backgroundColor
      : pressed
        ? theme.button[type].active.backgroundColor
        : theme.button[type].default.backgroundColor,
    borderColor: disabled
      ? theme.button[type].disabled.borderColor
      : pressed
        ? theme.button[type].active.borderColor
        : theme.button[type].default.borderColor,
  }),
  text: (type: ButtonType, pressed: boolean, disabled?: boolean) => ({
    color: disabled
      ? theme.button[type].disabled.textColor
      : pressed
        ? theme.button[type].active.textColor
        : theme.button[type].default.textColor,
  }),
  iconColor: (type: ButtonType, pressed: boolean, disabled?: boolean) => ({
    color: disabled
      ? theme.button[type].disabled.iconColor
      : pressed
        ? theme.button[type].active.iconColor
        : theme.button[type].default.iconColor,
  }),
}));
