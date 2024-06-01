export async function generateMetadata({ params }: { params: { id: number } }) {
  return {
    title: `Пацієнт #${params.id}`,
  };
}
export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
