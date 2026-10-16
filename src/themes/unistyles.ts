/* eslint-disable @typescript-eslint/no-empty-object-type */
import { StyleSheet } from "react-native-unistyles";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
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
