import { queryClient } from "@/queryClient";
import { isVersionAboveOrEqualToSupported } from "@/services/firebase/app-version";
import "@/themes/unistyles";
import { focusManager } from "@tanstack/react-query";
import "expo-router/entry";
import { getMessaging, onRegistered } from "firebase/messaging";
import { AppState, Platform } from "react-native";

// Refetch stale queries when the app returns from the background.
focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener("change", (state: string) => {
    handleFocus(state === "active");
  });
  // The "focus" event is Android-only; iOS throws if you subscribe to it.
  const sub2 =
    Platform.OS === "android"
      ? AppState.addEventListener("focus", () => handleFocus(true))
      : null;
  return () => {
    sub.remove();
    sub2?.remove();
  };
});

if (Platform.OS !== "web") {
  const {
    getMessaging,
    getToken,
    onMessage,
    setBackgroundMessageHandler,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require("@react-native-firebase/messaging");
  const messaging = getMessaging();
  getToken(messaging).then((token: string) =>
    console.log("FCM registration token:", token),
  );
  setBackgroundMessageHandler(messaging, async (remoteMessage: unknown) => {
    console.log("Message handled in the background!", remoteMessage);
  });
  onMessage(messaging, (remoteMessage: unknown) => {
    console.log("FCM foreground message:", remoteMessage);
  });
} else {
  const messaging = getMessaging();
  onRegistered(messaging, (token) => {
    console.log("FCM web token:", token);
  });
}

// Prefectch supportde app-version
async function main() {
  const noop = () => {};
  await Promise.allSettled([
    queryClient
      .query({
        queryKey: ["supported"],
        queryFn: isVersionAboveOrEqualToSupported,
      })
      .catch(noop),
  ]);
}
main();
