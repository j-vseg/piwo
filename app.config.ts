import { config as loadEnv } from "dotenv";
import { ConfigContext, ExpoConfig } from "expo/config";

const IS_PROD = process.env.APP_VARIANT === "production";

loadEnv({ path: IS_PROD ? ".env.prod" : ".env.dev" });

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: IS_PROD ? "Piwo" : "Piwo [DEV]",
  slug: "piwo",
  version: "2.6.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: IS_PROD ? "piwo" : "piwo-dev",
  userInterfaceStyle: "automatic",
  platforms: ["android", "web"],
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
    },
    package: IS_PROD
      ? "com.scoutingmierlo.piwo"
      : "com.scoutingmierlo.piwo.dev",
    googleServicesFile: IS_PROD
      ? "./google-services/google-services.json"
      : "./google-services/google-services-dev.json",
    versionCode: 9,
  },
  web: {
    output: "single",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F7F2EB",
        image: "./assets/images/splash-icon.png",
        dark: {
          backgroundColor: "#1C1618",
        },
        imageWidth: 124,
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "dynamic",
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "node_modules/@expo-google-fonts/niramit/600SemiBold/Niramit_600SemiBold.ttf",
          "node_modules/@expo-google-fonts/google-sans-flex/400Regular/GoogleSansFlex_400Regular.ttf",
          "node_modules/@expo-google-fonts/google-sans-flex/500Medium/GoogleSansFlex_500Medium.ttf",
          "node_modules/@expo-google-fonts/google-sans-flex/700Bold/GoogleSansFlex_700Bold.ttf",
          "./assets/fonts/MaterialSymbolsOutlined-200.ttf",
          "./assets/fonts/MaterialSymbolsOutlined-400.ttf",
          "./assets/fonts/MaterialSymbolsOutlined-500.ttf",
          "./assets/fonts/MaterialSymbolsOutlined-600.ttf",
        ],
        android: {
          fonts: [
            {
              fontFamily: "Niramit",
              fontDefinitions: [
                {
                  path: "node_modules/@expo-google-fonts/niramit/600SemiBold/Niramit_600SemiBold.ttf",
                  weight: 600,
                },
              ],
            },
            {
              fontFamily: "Google Sans Flex",
              fontDefinitions: [
                {
                  path: "node_modules/@expo-google-fonts/google-sans-flex/700Bold/GoogleSansFlex_700Bold.ttf",
                  weight: 700,
                },
                {
                  path: "node_modules/@expo-google-fonts/google-sans-flex/500Medium/GoogleSansFlex_500Medium.ttf",
                  weight: 500,
                },
                {
                  path: "node_modules/@expo-google-fonts/google-sans-flex/400Regular/GoogleSansFlex_400Regular.ttf",
                  weight: 400,
                },
              ],
            },
          ],
        },
      },
    ],
    "expo-sharing",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
