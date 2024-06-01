import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новий пацієнт",
};

export default function NewPatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
