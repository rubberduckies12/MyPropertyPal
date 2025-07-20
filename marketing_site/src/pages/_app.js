import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/react';
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* You can also use .png, .svg, etc. */}
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
