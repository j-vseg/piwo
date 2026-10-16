import { View, type ViewProps } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { theme } = useUnistyles();

  return (
    <View
      style={[{ backgroundColor: theme.colors.brand.primary }, style]}
      {...otherProps}
    />
  );
}
