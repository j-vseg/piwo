import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUnistyles } from "react-native-unistyles";

export default function SettingsLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
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
            backgroundColor: theme.screen.default.backgroundColor,
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
            backgroundColor: theme.screen.default.backgroundColor,
          },
          headerTintColor: theme.screen.default.headerTintColor,
        }}
      />
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
            backgroundColor: theme.screen.default.backgroundColor,
          },
          headerTintColor: theme.screen.default.headerTintColor,
        }}
      />
    </Stack>
  );
}
