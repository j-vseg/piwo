/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { darkColors, darkShadow } from "./dark";
import { lightColors, lightShadow } from "./light";

const typography = {
  family: Platform.select({
    ios: "System",
    android: "Roboto",
    default: "Poppins",
  }),
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "700" as const },
  h2: { fontSize: 24, lineHeight: 30, fontWeight: "700" as const },
  h3: { fontSize: 20, lineHeight: 26, fontWeight: "600" as const },
  h4: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  h5: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  bodyXs: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
  label: { fontSize: 14, lineHeight: 18, fontWeight: "500" as const },
  button: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
} as const;

const gap = (v: number) => v * 4;

const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const appThemes = {
  light: {
    colors: lightColors,
    typography,
    gap,
    radius,
    shadow: lightShadow,
  },
  dark: {
    colors: darkColors,
    typography,
    gap,
    radius,
    shadow: darkShadow,
  },
};

export const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

export type AppBreakpoints = typeof breakpoints;
export type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  breakpoints,
  themes: appThemes,
});
