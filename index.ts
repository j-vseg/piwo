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
