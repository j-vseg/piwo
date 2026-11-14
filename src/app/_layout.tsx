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
import { loadWebFontWeights } from "@/themes/loadWebFontWeights";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const approval = useAppStore((s) => s.approval);
  // expo-font config plugin only embeds fonts for native; web needs runtime loading
  const [fontsLoaded] = useFonts({
    "Google Sans Flex": require("@expo-google-fonts/google-sans-flex/400Regular/GoogleSansFlex_400Regular.ttf"),
    Niramit: require("@expo-google-fonts/niramit/400Regular/Niramit_400Regular.ttf"),
  });
  // On web, useFonts registers every @font-face without a font-weight descriptor, so the browser
  // uses the 400 file with faux-bold for other weights. Register the real files for 500/700/600.
  const [webFontsReady, setWebFontsReady] = useState(Platform.OS !== "web");
  useEffect(() => {
    if (Platform.OS !== "web" || !fontsLoaded) return;
    loadWebFontWeights().then(() => setWebFontsReady(true));
  }, [fontsLoaded]);

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
      {authReady && fontsLoaded && webFontsReady && (
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

          <Stack.Protected
            guard={
              !isLoggedIn &&
              !(
                Platform.OS === OS.Android &&
                isSupported.isSuccess &&
                isSupported.data === false
              )
            }
          >
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
