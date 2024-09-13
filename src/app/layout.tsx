import "@/css/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "@/shared/context/UserContextProvider";
import ToastContainerInstance from "@/components/toast/ToastContainerInstance";
import { Suspense } from "react";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider messages={messages}>
            <ToastContainerInstance></ToastContainerInstance>
            <UserContextProvider>
              <Suspense>{children}</Suspense>
            </UserContextProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  );
}
