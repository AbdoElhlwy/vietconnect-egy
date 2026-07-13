export const locales = ["ar", "en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string) {
  return rtlLocales.includes(locale as Locale);
}

import ar from "./dictionaries/ar.json";
import en from "./dictionaries/en.json";
import vi from "./dictionaries/vi.json";

const dictionaries = { ar, en, vi };

export function getDictionary(locale: string) {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}
