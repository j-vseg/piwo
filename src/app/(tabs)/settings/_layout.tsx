import { Role } from "@/constants/Role";
import { useAppStore } from "@/store/appStore";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUnistyles } from "react-native-unistyles";

export default function SettingsLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const role = useAppStore((s) => s.role);
  const isAuthorized = role === Role.BoardMember || role === Role.Advisor;

  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isAuthorized}>
        <Stack.Screen
          name="create-activity"
          options={{
            headerShown: true,
            title: t("tabs.settings.createActivity"),
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: theme.text.h3.fontFamily,
              fontWeight: theme.text.h3.fontWeight,
              fontSize: theme.text.h3.fontSize,
            },
            headerStyle: {
              backgroundColor: theme.colors.category.weekend,
            },
            headerTintColor: theme.screen.default.headerTintColor,
          }}
        />
        <Stack.Screen
          name="update-activity"
          options={{
            headerShown: true,
            title: t("tabs.settings.editActivity"),
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: theme.text.h3.fontFamily,
              fontWeight: theme.text.h3.fontWeight,
              fontSize: theme.text.h3.fontSize,
            },
            headerStyle: {
              backgroundColor: theme.colors.category.weekend,
            },
            headerTintColor: theme.screen.default.headerTintColor,
          }}
        />
      </Stack.Protected>
      <Stack.Screen
        name="personal-details"
        options={{
          headerShown: true,
          title: t("tabs.settings.personalDetails"),
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

      <Stack.Screen
        name="installation"
        options={{
          headerShown: true,
          title: t("tabs.settings.installation"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: theme.text.h3.fontFamily,
            fontWeight: theme.text.h3.fontWeight,
            fontSize: theme.text.h3.fontSize,
          },
          headerStyle: {
            backgroundColor: theme.colors.category.action,
          },
          headerTintColor: theme.screen.default.headerTintColor,
        }}
      />

      <Stack.Screen
        name="about-app"
        options={{
          headerShown: true,
          title: t("tabs.settings.aboutApp"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: theme.text.h3.fontFamily,
            fontWeight: theme.text.h3.fontWeight,
            fontSize: theme.text.h3.fontSize,
          },
          headerStyle: {
            backgroundColor: theme.colors.category.action,
          },
          headerTintColor: theme.screen.default.headerTintColor,
        }}
      />

      <Stack.Screen
        name="what-is-new"
        options={{
          headerShown: true,
          title: t("tabs.settings.whatIsNew"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: theme.text.h3.fontFamily,
            fontWeight: theme.text.h3.fontWeight,
            fontSize: theme.text.h3.fontSize,
          },
          headerStyle: {
            backgroundColor: theme.colors.category.action,
          },
          headerTintColor: theme.screen.default.headerTintColor,
        }}
      />
    </Stack>
  );
}
