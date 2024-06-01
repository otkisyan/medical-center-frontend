export async function generateMetadata({ params }: { params: { id: number } }) {
  return {
    title: `Прийом #${params.id}`,
  };
}
export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
