import { getTextTrim } from "@/themes/capsize";
import {
  StyleSheet as RNStyleSheet,
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";
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
  /**
   * Trims the space above the cap height and below the baseline, so the text box is as tall as
   * the letters (capsize). Default true. Turn it off where a container needs the full line box,
   * such as text that is centred in a fixed height.
   */
  trim?: boolean;
};

export function ThemedText({
  style,
  type = "default",
  weight,
  trim = true,
  ...rest
}: ThemedTextProps) {
  const textStyle: StyleProp<TextStyle> = [
    styles.text,
    styles[type],
    style,
    weight && styles.weight(weight),
  ];

  if (!trim) {
    return <Text style={textStyle} {...rest} />;
  }

  const {
    fontFamily,
    fontSize,
    lineHeight,
    margin,
    marginVertical,
    marginTop,
    marginBottom,
  }: TextStyle = RNStyleSheet.flatten(textStyle) ?? {};

  return (
    <Text
      style={[
        textStyle,
        styles.trim(
          fontFamily,
          fontSize,
          lineHeight,
          numberOrZero(marginTop ?? marginVertical ?? margin),
          numberOrZero(marginBottom ?? marginVertical ?? margin),
        ),
      ]}
      {...rest}
    />
  );
}

function numberOrZero(value: unknown) {
  return typeof value === "number" ? value : 0;
}

const styles = StyleSheet.create((theme, rt) => ({
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
  // Adds the trims to the margins the text already has, so a margin from `style` still applies.
  trim: (
    fontFamily: string | undefined,
    fontSize: number | undefined,
    lineHeight: number | undefined,
    marginTop: number,
    marginBottom: number,
  ) => {
    const trim = getTextTrim({
      fontFamily,
      fontSize,
      lineHeight,
      fontScale: rt.fontScale,
    });
    return trim
      ? {
          marginTop: marginTop + trim.marginTop,
          marginBottom: marginBottom + trim.marginBottom,
        }
      : {};
  },
}));
