import "@/firebase";
import "@/themes/unistyles";
import "@/translations/i18n";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { queryClient } from "@/queryClient";
import { onAuthStateChanged } from "@/services/firebase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { useUnistyles } from "react-native-unistyles";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useUnistyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  // expo-font config plugin only embeds fonts for native; web needs runtime loading
  const [fontsLoaded] = useFonts({
    "Crimson Pro": require("@expo-google-fonts/crimson-pro/600SemiBold/CrimsonPro_600SemiBold.ttf"),
    Poppins: require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf"),
    "Poppins-SemiBold": require("@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf"),
  });

  useEffect(() => {
    return onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (!authReady) {
        setAuthReady(true);
        SplashScreen.hideAsync();
      }
    });
  }, [authReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedSplashOverlay />
      {authReady && fontsLoaded && (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="index" />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="activity/[id]"
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
          </Stack.Protected>
        </Stack>
      )}
    </QueryClientProvider>
  );
}
