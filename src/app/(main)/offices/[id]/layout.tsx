import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { id: number } }) {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("specific_office", { id: params.id }),
  };
}

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
