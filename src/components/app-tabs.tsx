import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUnistyles } from "react-native-unistyles";

export default function AppTabs() {
  const { theme } = useUnistyles();

  return (
    <NativeTabs
      backgroundColor={theme.colors.brand.primary}
      indicatorColor={theme.colors.brand.primary}
      labelStyle={{ selected: { color: theme.colors.brand.primary } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
