import { FontAwesome } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { type ColorValue, type StyleProp, type TextStyle } from "react-native";

export type IconName = ComponentProps<typeof FontAwesome>["name"];

export const IconSymbol = React.memo(function IconSymbol({
  name,
  size = 24,
  color,
  style,
  accessible = false,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string;
  accessible?: boolean;
}) {
  const iconColor = color as ComponentProps<typeof FontAwesome>["color"];

  return (
    <FontAwesome
      color={iconColor}
      size={size}
      name={name}
      style={style}
      accessible={accessible}
    />
  );
});
