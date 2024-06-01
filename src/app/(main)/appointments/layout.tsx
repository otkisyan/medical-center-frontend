import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Прийоми",
};

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
