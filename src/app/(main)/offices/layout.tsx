import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кабінети",
};

export default function OfficesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
