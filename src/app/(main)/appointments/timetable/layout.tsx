import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Розклад",
};

export default function TimetableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
