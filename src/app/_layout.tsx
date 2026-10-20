import "@/themes/unistyles";
import "@/translations/i18n";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { Approval } from "@/constants/Approval";
import { OS } from "@/constants/Os";
import { queryClient } from "@/queryClient";
import { getAccount } from "@/services/firebase/accounts";
import { isVersionAboveOrEqualToSupported } from "@/services/firebase/app-version";
import { onAuthStateChanged } from "@/services/firebase/auth";
import { useAppStore } from "@/store/appStore";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const approval = useAppStore((s) => s.approval);
  // expo-font config plugin only embeds fonts for native; web needs runtime loading
  const [fontsLoaded] = useFonts({
    "Crimson Pro": require("@expo-google-fonts/crimson-pro/600SemiBold/CrimsonPro_600SemiBold.ttf"),
    Poppins: require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf"),
    "Poppins-SemiBold": require("@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf"),
  });

  const isSupported = useQuery(
    {
      queryKey: ["supported"],
      queryFn: isVersionAboveOrEqualToSupported,
    },
    queryClient,
  );

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
      {authReady && fontsLoaded && (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected
            guard={
              Platform.OS === OS.Android &&
              isSupported.isSuccess &&
              isSupported.data === false
            }
          >
            <Stack.Screen
              name="app-update"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="index" />
            <Stack.Screen name="sign-up" />
          </Stack.Protected>

          <Stack.Protected guard={isLoggedIn && approval === Approval.Accepted}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>

          <Stack.Protected guard={isLoggedIn && approval !== Approval.Accepted}>
            <Stack.Screen name="verify" />
          </Stack.Protected>

          <Stack.Screen
            name="what-is-new"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
      )}
    </QueryClientProvider>
  );
}
