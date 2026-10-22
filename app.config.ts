import { config as loadEnv } from "dotenv";
import { ConfigContext, ExpoConfig } from "expo/config";

const IS_PROD = process.env.APP_VARIANT === "production";

loadEnv({ path: IS_PROD ? ".env.prod" : ".env.dev" });

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: IS_PROD ? "Piwo" : "Piwo [DEV]",
  slug: "piwo",
  version: "2.4.2",
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
    versionCode: 7,
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
        backgroundColor: "#ffd9ad",
        image: "./assets/images/splash-icon.png",
        dark: {
          backgroundColor: "#2A2117",
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
          "node_modules/@expo-google-fonts/crimson-pro/600SemiBold/CrimsonPro_600SemiBold.ttf",
          "node_modules/@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf",
          "node_modules/@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf",
        ],
      },
    ],
    "expo-sharing",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
