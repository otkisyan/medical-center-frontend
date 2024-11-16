"use client";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: "uk",
          label: t("uk"),
        },
        {
          value: "en-GB",
          label: t("en-GB"),
        },
      ]}
      label={t("language_label")}
    />
  );
}
