export async function generateMetadata({ params }: { params: { id: number } }) {
  return {
    title: `Кабінет #${params.id}`,
  };
}
export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
