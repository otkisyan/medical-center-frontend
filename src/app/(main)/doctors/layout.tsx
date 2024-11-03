import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { id: number } }) {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("doctors", { id: params.id }),
  };
}

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
