import type { Metadata } from "next";
import "@/css/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "@/shared/context/UserContextProvider";
import Wrapper from "@/components/layout/Wrapper";
import NavBar from "@/components/layout/NavBar";
import ToastContainerInstance from "@/components/toast/ToastContainerInstance";
import { Suspense } from "react";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Locale } from "@/i18n/config";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "PagesNavigation" });

  return {
    title: t("home_page"),
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar></NavBar>
      <Wrapper>{children}</Wrapper>
    </>
  );
}
