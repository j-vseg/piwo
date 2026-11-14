import { Text, type TextProps, type TextStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type TypographyVariant =
  | "default"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "bodyLargest"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "bodySmaller"
  | "tag"
  | "menu"
  | "button"
  | "span"
  | "tabButtonLabel";

export type ThemedTextProps = TextProps & {
  type?: TypographyVariant;
  weight?: TextStyle["fontWeight"];
};

export function ThemedText({
  style,
  type = "default",
  weight,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        styles.text,
        styles[type],
        style,
        weight && styles.weight(weight),
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  text: theme.text.text,
  default: theme.text.bodyMedium,
  h1: theme.text.h1,
  h2: theme.text.h2,
  h3: theme.text.h3,
  h4: theme.text.h4,
  h5: theme.text.h5,
  bodyLargest: theme.text.bodyLargest,
  bodyLarge: theme.text.bodyLarge,
  bodyMedium: theme.text.bodyMedium,
  bodySmall: theme.text.bodySmall,
  bodySmaller: theme.text.bodySmaller,
  tag: theme.text.tag,
  menu: theme.text.menu,
  button: theme.text.button,
  span: theme.text.span,
  tabButtonLabel: theme.text.tabButtonLabel,
  weight: (fontWeight: TextStyle["fontWeight"]) => ({
    fontWeight,
  }),
}));
