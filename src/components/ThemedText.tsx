import { Text, type TextProps, type TextStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";

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
  const { theme } = useUnistyles();

  return (
    <Text
      style={[
        theme.text.text,
        type === "default" && theme.text.bodyMedium,
        type === "h1" && theme.text.h1,
        type === "h2" && theme.text.h2,
        type === "h3" && theme.text.h3,
        type === "h4" && theme.text.h4,
        type === "h5" && theme.text.h5,
        type === "bodyLargest" && theme.text.bodyLargest,
        type === "bodyLarge" && theme.text.bodyLarge,
        type === "bodyMedium" && theme.text.bodyMedium,
        type === "bodySmall" && theme.text.bodySmall,
        type === "bodySmaller" && theme.text.bodySmaller,
        type === "menu" && theme.text.menu,
        type === "button" && theme.text.button,
        type === "span" && theme.text.span,
        style,
        weight && { fontWeight: weight },
      ]}
      {...rest}
    />
  );
}
