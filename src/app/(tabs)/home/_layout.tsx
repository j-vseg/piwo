import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

export default function SettingsLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="activity"
        options={{
          headerShown: true,
          title: "",
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
