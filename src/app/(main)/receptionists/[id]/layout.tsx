import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { id: number } }) {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("specific_receptionist", { id: params.id }),
  };
}

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
