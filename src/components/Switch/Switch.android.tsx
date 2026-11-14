import { Host } from "@expo/ui";
import { Switch as ComposeSwitch } from "@expo/ui/jetpack-compose";
import { useUnistyles } from "react-native-unistyles";
import type { SwitchProps } from "./types";

export function Switch({ value, disabled }: SwitchProps) {
  const { theme } = useUnistyles();

  return (
    <Host
      matchContents
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
    >
      <ComposeSwitch
        value={value}
        enabled={!disabled}
        colors={{
          checkedThumbColor: theme.colors.light["white"],
          checkedTrackColor: theme.colors.primitives["primary"],
          checkedBorderColor: theme.colors.primitives["primary"],
          uncheckedThumbColor: theme.colors.dark["greyMedium"],
          uncheckedTrackColor: theme.colors.dark["greyLight"],
          uncheckedBorderColor: theme.colors.dark["greyMedium"],
        }}
      />
    </Host>
  );
}
