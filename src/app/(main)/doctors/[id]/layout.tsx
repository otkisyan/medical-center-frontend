import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { id: number } }) {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("specific_doctor", { id: params.id }),
  };
}
export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
