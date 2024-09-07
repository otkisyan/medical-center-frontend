import "@/css/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "@/shared/context/UserContextProvider";
import ToastContainerInstance from "@/components/toast/ToastContainerInstance";
import { Suspense } from "react";

export default function RootLayout({
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
            <Suspense>{children}</Suspense>
          </UserContextProvider>
        </body>
      </html>
    </>
  );
}
