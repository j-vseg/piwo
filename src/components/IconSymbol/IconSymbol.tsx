import { createIconSet } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { type ColorValue, type StyleProp, type TextStyle } from "react-native";
import materialIconsOutlinedMap from "./material-icons-outlined-map.json";

export type IconName = ComponentProps<(typeof Icon)[200]>["name"];

export const materialIcons200 = createIconSet(
  materialIconsOutlinedMap,
  "Material Symbols Outlined 200",
  require("@/assets/fonts/MaterialSymbolsOutlined-200.ttf"),
);

export const materialIcons400 = createIconSet(
  materialIconsOutlinedMap,
  "Material Symbols Outlined 400",
  require("@/assets/fonts/MaterialSymbolsOutlined-400.ttf"),
);

export const materialIcons500 = createIconSet(
  materialIconsOutlinedMap,
  "Material Symbols Outlined 500",
  require("@/assets/fonts/MaterialSymbolsOutlined-500.ttf"),
);

export const materialIcons600 = createIconSet(
  materialIconsOutlinedMap,
  "Material Symbols Outlined 600",
  require("@/assets/fonts/MaterialSymbolsOutlined-600.ttf"),
);

export const Icon = {
  "200": materialIcons200,
  "400": materialIcons400,
  "500": materialIcons500,
  "600": materialIcons600,
} as const;

export const IconSymbol = React.memo(function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "200",
  accessible = false,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<TextStyle>;
  weight?: keyof typeof Icon;
  accessible?: boolean;
}) {
  const Component = Icon[weight];

  // @expo/vector-icons types `color` narrower than React Native's ColorValue, but it forwards
  // the value straight into a Text style, which accepts any ColorValue.
  const iconColor = color as ComponentProps<typeof Component>["color"];

  return (
    <Component
      color={iconColor}
      size={size}
      name={name}
      style={style}
      accessible={accessible}
    />
  );
});
