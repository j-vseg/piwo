import { HapticTab } from "@/components/HapticTap";
import { ThemedText } from "@/components/ThemedText";
import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import { accountsCollection } from "@/firebase";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { query, where } from "@react-native-firebase/firestore";
import { ComponentProps } from "react";
import { useUnistyles } from "react-native-unistyles";

type BottomTabNavigationOptions = NonNullable<
  ComponentProps<typeof Tabs>["screenOptions"]
>;

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const role = useAppStore((s) => s.role);
  const { data } = useQuery({
    queryKey: ["not-approved-users"],
    queryFn:
      role === Role.BoardMember || role === Role.Advisor
        ? () =>
            fetchAllAccounts(
              query(
                accountsCollection,
                where("approval", "==", Approval.Unknown),
              ),
            )
        : skipToken,
  });

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

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="cabin" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
        }}
      />

      <Tabs.Screen
        name="manage"
        options={{
          title: t("tabs.manage"),
          tabBarBadge:
            data && data.length !== 0
              ? data.length > 9
                ? "9+"
                : String(data.length)
              : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="group" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
          href:
            role === Role.BoardMember || role === Role.Advisor
              ? "/manage"
              : null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings.main"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins" },
        }}
      />
    </Tabs>
  );
}
