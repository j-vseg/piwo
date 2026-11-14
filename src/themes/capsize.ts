import { precomputeValues } from "@capsizecss/core";
import googleSansFlex from "@capsizecss/metrics/googleSansFlex";
import niramit from "@capsizecss/metrics/niramit";
import { PixelRatio, Platform } from "react-native";

// Keyed by the fontFamily names the theme uses. The values match the bundled font files.
const fontMetrics: Record<string, typeof googleSansFlex> = {
  "Google Sans Flex": googleSansFlex,
  Niramit: niramit,
};

export type TextTrim = { marginTop: number; marginBottom: number };

const cache = new Map<string, TextTrim | undefined>();

/**
 * Negative margins that trim a text box to the cap height at the top and to the baseline at the
 * bottom (capsize). Spacing around trimmed text then matches the design, whatever the font's
 * ascent, descent and line height. Returns undefined for a font without metrics.
 */
export function getTextTrim({
  fontFamily,
  fontSize,
  lineHeight,
  fontScale = 1,
}: {
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  fontScale?: number;
}): TextTrim | undefined {
  const metrics = fontFamily ? fontMetrics[fontFamily] : undefined;
  if (!metrics || !fontSize) {
    return undefined;
  }

  const key = `${fontFamily}|${fontSize}|${lineHeight}|${fontScale}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  const values = precomputeValues(
    lineHeight
      ? { fontSize, leading: lineHeight, fontMetrics: metrics }
      : { fontSize, lineGap: metrics.lineGap, fontMetrics: metrics },
  );
  // The trims are in em. React Native scales the font size and line height by the system font
  // scale, so the trims scale with it.
  const em = fontSize * fontScale;
  const iosOffset = getIosOffset(metrics, fontSize, lineHeight) * fontScale;
  const trim = {
    marginTop: PixelRatio.roundToNearestPixel(
      Number.parseFloat(values.capHeightTrim) * em + iosOffset,
    ),
    marginBottom: PixelRatio.roundToNearestPixel(
      Number.parseFloat(values.baselineTrim) * em - iosOffset,
    ),
  };
  cache.set(key, trim);
  return trim;
}

/**
 * With a line height smaller than the font's own height, iOS does not centre the text in the line:
 * it leaves out the negative half-leading and draws the text that much higher than Android and CSS
 * do. The trims assume centred text, so on iOS the text box moves down by that amount.
 */
function getIosOffset(
  metrics: typeof googleSansFlex,
  fontSize: number,
  lineHeight: number | undefined,
) {
  if (Platform.OS !== "ios" || !lineHeight) {
    return 0;
  }
  const contentHeight =
    ((metrics.ascent - metrics.descent + metrics.lineGap) /
      metrics.unitsPerEm) *
    fontSize;
  return Math.max(0, (contentHeight - lineHeight) / 2);
}
