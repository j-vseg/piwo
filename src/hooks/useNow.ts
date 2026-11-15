import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

/**
 * Returns the current date and time, optionally updating at a specified interval.
 * Useful for rendering timestamps or time-based logic.
 *
 * @param options - Configuration options for the hook
 * @param options.updateInterval - The interval in milliseconds at which to update the current time.
 *                                  If not provided or <= 0, the time will not auto-update.
 * @returns The current Date object, updated at the specified interval if configured
 *
 * @example
 * // Get current time without auto-updates
 * const now = useNow();
 *
 * @example
 * // Get current time that updates every second
 * const now = useNow({ updateInterval: 1000 });
 */
export function useNow(options?: { updateInterval?: number }) {
  const { updateInterval } = options ?? {};

  const appState = useRef(AppState.currentState);

  const [now, setNow] = useState(new Date());

  // Automatically update the time at a specified interval.
  useEffect(() => {
    if (updateInterval === undefined || updateInterval <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setNow(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  // Update the current time when the app comes to the foreground to prevent showing a stale time.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current?.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground
        setNow(new Date());
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return now;
}
