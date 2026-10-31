import { type ReactNode } from "react";
import { Text, type TextProps } from "react-email";

type TypographyVariant =
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
  | "span";

const variantClasses: Record<TypographyVariant, string> = {
  default: "font-poppins text-body-medium",
  h1: "font-crimson-pro text-h1",
  h2: "font-crimson-pro text-h2",
  h3: "font-crimson-pro text-h3",
  h4: "font-crimson-pro text-h4",
  h5: "font-crimson-pro text-h5",
  bodyLargest: "font-poppins text-body-largest",
  bodyLarge: "font-poppins text-body-large",
  bodyMedium: "font-poppins text-body-medium",
  bodySmall: "font-poppins text-body-small",
  bodySmaller: "font-poppins text-body-smaller",
  menu: "font-poppins text-menu",
  button: "font-crimson-pro text-btn",
  span: "font-poppins text-span",
};

export function ThemedText({
  type = "default",
  className,
  children,
  ...rest
}: TextProps & { type?: TypographyVariant; children: ReactNode }) {
  return (
    <Text
      className={`text-dark-black ${variantClasses[type]} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Text>
  );
}
