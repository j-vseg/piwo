import { Role } from "@/constants/Role";
import { useAppStore } from "@/store/appStore";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUnistyles } from "react-native-unistyles";

export default function ManageLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const role = useAppStore((s) => s.role);
  const isAuthorized = role === Role.BoardMember || role === Role.Advisor;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthorized}>
        <Stack.Screen name="index" />

        <Stack.Screen
          name="manage-user"
          options={{
            headerShown: true,
            title: t("tabs.bestuur.manageUsers"),
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: theme.text.h3.fontFamily,
              fontWeight: theme.text.h3.fontWeight,
              fontSize: theme.text.h3.fontSize,
            },
            headerStyle: {
              backgroundColor: theme.colors.category.camp,
            },
            headerTintColor: theme.screen.default.headerTintColor,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
