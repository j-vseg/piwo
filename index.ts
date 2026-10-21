import "@/config/firebase/messaging";
import { queryClient } from "@/queryClient";
import { isVersionAboveOrEqualToSupported } from "@/services/firebase/app-version";
import "@/themes/unistyles";
import { focusManager } from "@tanstack/react-query";
import "expo-router/entry";
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
