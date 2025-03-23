import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MainLayout } from "@/screens/layout.tsx/main-layout";
export default function App({ Component, pageProps }: AppProps) {
  return <MainLayout>
    <Component {...pageProps} />
  </MainLayout>;
}
