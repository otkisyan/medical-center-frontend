import type { AppProps } from "next/app";
import { UserContextProvider } from "@/context/UserContextProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <h1>lol</h1>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </>
  );
}
