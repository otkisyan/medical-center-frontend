import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пацієнти",
};

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
