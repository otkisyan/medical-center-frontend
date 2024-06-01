export async function generateMetadata({ params }: { params: { id: number } }) {
  return {
    title: `Лікар #${params.id}`,
  };
}
export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
