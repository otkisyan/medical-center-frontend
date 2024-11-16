export type Locale = (typeof locales)[number];

export const locales = ["uk", "en-GB"] as const;
export const defaultLocale: Locale = "uk";
