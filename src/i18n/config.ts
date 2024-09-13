export type Locale = (typeof locales)[number];

export const locales = ["ua", "en"] as const;
export const defaultLocale: Locale = "ua";
