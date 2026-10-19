import "@/firebase";
import "@/themes/unistyles";
import "@/translations/i18n";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { queryClient } from "@/queryClient";
import { getAccount } from "@/services/firebase/accounts";
import { onAuthStateChanged } from "@/services/firebase/auth";
import { useAppStore } from "@/store/appStore";
import { QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  // expo-font config plugin only embeds fonts for native; web needs runtime loading
  const [fontsLoaded] = useFonts({
    "Crimson Pro": require("@expo-google-fonts/crimson-pro/600SemiBold/CrimsonPro_600SemiBold.ttf"),
    Poppins: require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf"),
    "Poppins-SemiBold": require("@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf"),
  });

  useEffect(() => {
    const { setAccount, clearAccount } = useAppStore.getState();
    return onAuthStateChanged(async (user) => {
      const firebaseUser = user as { uid: string; email: string | null } | null;
      if (firebaseUser) {
        const account = await getAccount(firebaseUser.uid);
        if (account) {
          setAccount({
            role: account.role,
            approval: account.approval,
          });
        }
      } else {
        clearAccount();
      }
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
          </Stack.Protected>
        </Stack>
      )}
    </QueryClientProvider>
  );
}
