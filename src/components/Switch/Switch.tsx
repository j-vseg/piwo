import { Switch as RNSwitch } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedView } from "../ThemedView";
import type { SwitchProps } from "./types";

export function Switch({ value, disabled }: SwitchProps) {
  const { theme } = useUnistyles();

  return (
    <ThemedView
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ backgroundColor: "transparent" }}
    >
      <RNSwitch
        value={value}
        disabled={disabled}
        thumbColor={
          value ? theme.colors.light["white"] : theme.colors.dark["greyMedium"]
        }
        trackColor={{
          true: theme.colors.category["groupDark"],
          false: theme.colors.light["offWhite"],
        }}
      />
    </ThemedView>
  );
}
