import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Лікарі",
};

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
