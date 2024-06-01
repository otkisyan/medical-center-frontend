import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новий кабінет",
};

export default function NewOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
