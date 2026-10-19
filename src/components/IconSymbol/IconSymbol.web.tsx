import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { type ColorValue, type StyleProp, type TextStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export const IconSymbol = React.memo(function IconSymbol({
  name,
  size = 24,
  color,
  style,
  accessible = false,
}: {
  name: MaterialIconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<TextStyle>;
  accessible?: boolean;
}) {
  const iconColor = color as ComponentProps<typeof FontAwesome>["color"];

  return (
    <MaterialIcons
      color={iconColor}
      size={size}
      name={name}
      style={style}
      accessible={accessible}
    />
  );
});
