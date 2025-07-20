import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/react';
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        {/* You can also use .png, .svg, etc. */}
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
