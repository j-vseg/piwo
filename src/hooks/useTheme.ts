import { DefaultTheme, Theme } from "expo-router/react-navigation";
import { useMemo } from "react";
import { useUnistyles } from "react-native-unistyles";

export default function useNavigationTheme(): Theme {
  const { theme } = useUnistyles();

  return useMemo(() => {
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.screen.default["backgroundColor"],
      },
    };
  }, [theme.screen.default]);
}
