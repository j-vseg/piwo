import { Asset } from "expo-asset";
import { Platform } from "react-native";

/**
 * On web, registers additional @font-face rules with `font-weight` descriptors so the browser's
 * CSS font matching picks the correct font file for each weight.
 *
 * `expo-font`'s `useFonts` creates every @font-face without a weight descriptor, so the browser
 * defaults to weight 400 and applies synthetic (faux) bold for any other requested weight.
 * The native side doesn't need this — the expo-font config plugin in `app.config.ts` registers
 * each file with its proper weight via `fontDefinitions`.
 */
export async function loadWebFontWeights(): Promise<void> {
  if (Platform.OS !== "web") return;

  const entries: Array<{
    family: string;
    source: number;
    weight: string;
  }> = [
    {
      family: "Google Sans Flex",
      source: require("@expo-google-fonts/google-sans-flex/500Medium/GoogleSansFlex_500Medium.ttf"),
      weight: "500",
    },
    {
      family: "Google Sans Flex",
      source: require("@expo-google-fonts/google-sans-flex/700Bold/GoogleSansFlex_700Bold.ttf"),
      weight: "700",
    },
    {
      family: "Niramit",
      source: require("@expo-google-fonts/niramit/600SemiBold/Niramit_600SemiBold.ttf"),
      weight: "600",
    },
  ];

  await Promise.all(
    entries.map(async ({ family, source, weight }) => {
      const asset = Asset.fromModule(source);
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      const face = new FontFace(family, `url("${uri}")`, { weight });
      (document as any).fonts.add(face);
      await face.load();
    }),
  );
}
