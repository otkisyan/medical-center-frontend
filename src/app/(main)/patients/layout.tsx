import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("patients"),
  };
}

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
