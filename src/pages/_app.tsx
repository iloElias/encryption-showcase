import { StepsProvider } from "@/context/StepsProvider";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <StepsProvider>
        <Component {...pageProps} />
      </StepsProvider>
    </NextUIProvider>
  );
}
