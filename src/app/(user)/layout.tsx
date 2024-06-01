import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { UserContextProvider } from "@/shared/context/UserContextProvider";
import Wrapper from "@/components/layout/Wrapper";
import ToastContainerInstance from "@/components/toast/ToastContainerInstance";

export const metadata: Metadata = {
  title: "Авторизація",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body>
          <ToastContainerInstance></ToastContainerInstance>
          <UserContextProvider>
            <Wrapper>{children}</Wrapper>
          </UserContextProvider>
        </body>
      </html>
    </>
  );
}
