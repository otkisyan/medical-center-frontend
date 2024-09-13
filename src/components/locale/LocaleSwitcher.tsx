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
          value: "ua",
          label: t("ua"),
        },
        {
          value: "en",
          label: t("en"),
        },
      ]}
      label={t("language_label")}
    />
  );
}
