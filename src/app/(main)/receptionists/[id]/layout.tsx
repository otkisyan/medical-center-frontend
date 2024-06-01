export async function generateMetadata({ params }: { params: { id: number } }) {
  return {
    title: `Реєстратор #${params.id}`,
  };
}
export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
