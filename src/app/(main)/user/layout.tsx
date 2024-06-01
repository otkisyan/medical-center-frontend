import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обліковий запис",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
