import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новий лікар",
};

export default function NewDoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
