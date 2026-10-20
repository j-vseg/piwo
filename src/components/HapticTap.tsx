import { PlatformPressable } from "expo-router/react-navigation";
import type { ComponentProps } from "react";

type BottomTabBarButtonProps = ComponentProps<typeof PlatformPressable>;

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      pressColor="rgba(0, 0, 0, .08)"
      {...props}
      onPressIn={(ev) => {
        props.onPressIn?.(ev);
      }}
    />
  );
}
