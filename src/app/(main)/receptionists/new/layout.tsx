import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новий реєстратор",
};

export default function NewReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> {children} </>;
}
