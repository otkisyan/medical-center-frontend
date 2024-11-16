import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("new_patient"),
  };
}

export default function NewPatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
