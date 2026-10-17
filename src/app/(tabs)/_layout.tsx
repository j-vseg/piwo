import { HapticTab } from "@/components/HapticTap";
import { IconSymbol } from "@/components/IconSymbol/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { OS } from "@/constants/Os";
import { useTranslation } from "@/translations/i18n";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { ComponentProps } from "react";
import { Platform } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type BottomTabNavigationOptions = NonNullable<
  ComponentProps<typeof Tabs>["screenOptions"]
>;

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  const screenOptions: BottomTabNavigationOptions = {
    tabBarInactiveTintColor: theme.tabBar.inactiveTintColor,
    tabBarActiveTintColor: theme.tabBar.activeTintColor,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarLabel: ({ color, children }) => (
      <ThemedText type="menu" style={[{ color }]}>
        {children}
      </ThemedText>
    ),
    tabBarIconStyle: {
      overflow: "visible",
    },
    tabBarStyle: {
      borderTopWidth: 0,
      backgroundColor: theme.tabBar.backgroundColor,
      boxShadow: theme.tabBar.shadow,
    },
  };

  if (Platform.OS !== OS.Web) {
    return (
      <NativeTabs
        backgroundColor={theme.colors.light.white}
        indicatorColor={theme.colors.primitives.quinary}
        labelStyle={{ selected: { color: theme.colors.primitives.primary } }}
        iconColor={{
          default: theme.tabBar.inactiveTintColor,
          selected: theme.tabBar.activeTintColor,
        }}
      >
        <NativeTabs.Trigger name="home">
          <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/tabIcons/cabin.png")}
            renderingMode="template"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>
            {t("tabs.settings.main")}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/tabIcons/settings.png")}
            renderingMode="template"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name={"house-flag" as any} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings.main"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name={"gear" as any} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
        }}
      />
    </Tabs>
  );
}
