import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Реєстратори",
};

export default function ReceptionistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
