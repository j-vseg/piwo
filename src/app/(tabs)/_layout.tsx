import { HapticTab } from "@/components/HapticTap";
import { IconSymbol } from "@/components/IconSymbol/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { OS } from "@/constants/Os";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { ComponentProps, useMemo } from "react";
import { Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type BottomTabNavigationOptions = NonNullable<
  ComponentProps<typeof Tabs>["screenOptions"]
>;

export default function TabsLayout() {
  const { theme } = useUnistyles();

  const screenOptions: BottomTabNavigationOptions = useMemo(() => {
    return {
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
      tabBarStyle: styles.tabBar,
    };
  }, [theme]);

  if (Platform.OS !== OS.Web) {
    return (
      <NativeTabs
        backgroundColor={theme.colors.light.white}
        indicatorColor={theme.colors.primitives.quinary}
        labelStyle={{ selected: { color: theme.colors.primitives.primary } }}
      >
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/tabIcons/home.png")}
            renderingMode="template"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="explore">
          <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/tabIcons/home.png")}
            renderingMode="template"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol weight="500" size={24} name="home" color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol weight="500" size={24} name="home" color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  tabBar: {
    borderTopWidth: 0,
    height: 56 + rt.insets.bottom,
    backgroundColor: theme.tabBar.backgroundColor,
    boxShadow: theme.tabBar.shadow,
  },
}));
