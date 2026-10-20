import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import nlTranslations from "./nl.json";

// Currently a fixed locale since multi-language is not supported.
// To read it from the device: getLocales()[0]?.languageCode.
const LOCALE = "nl-NL";

// Configure the default i18next instance. `initReactI18next` registers it as
// the instance used by `useTranslation` / `<Trans>`, so no provider is needed.
// eslint-disable-next-line import/no-named-as-default-member -- `.use` is the i18next instance method, not the named export
i18next.use(initReactI18next).init({
  lng: LOCALE,
  fallbackLng: LOCALE,
  resources: {
    [LOCALE]: { translation: nlTranslations },
  },
  // Initialize synchronously so `i18n.t(...)` resolves at module load (some
  // translations are used in module-level constants).
  initAsync: false,
  // React Native renders text, not HTML — disable HTML entity escaping.
  interpolation: { escapeValue: false },
});

// Locale-aware euro formatter for use in translations via `{{value, euro}}`.
// Shows 4 fraction digits for tiny non-zero rates (e.g. €/GJ chart values) and
// 2 otherwise, so prices read as proper Dutch currency (e.g. "€ 12,50").
i18next.services.formatter?.add("euro", (value) => {
  const amount = typeof value === "number" ? value : Number(value) || 0;
  const absolute = Math.abs(amount);
  const maximumFractionDigits = absolute > 0 && absolute < 0.005 ? 4 : 2;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(amount);
});

export const i18n = i18next;

// Re-exported so packages can render rich-text translations (React components
// interpolated into a string) without depending on react-i18next directly.
export { Trans, useTranslation } from "react-i18next";

// Re-exported so helper functions can accept the translate function as a typed
// parameter (`t: TFunction`) instead of reaching for the global `i18n`.
export type { TFunction } from "i18next";