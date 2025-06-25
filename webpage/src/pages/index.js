import Landing from "./landing/landing.jsx";
import Head from "next/head.js";

export default function Home() {
  return (
    <>
      <Head>
        <title>MyPropertyPal – Automate your rental business</title>
        <meta name="description" content="Streamline your rental business with powerful tools, built for landlords and loved by tenants. Save time, reduce stress, and focus on what matters most." />
        <meta property="og:title" content="MyPropertyPal – Automate your rental business" />
        <meta property="og:description" content="Streamline your rental business with powerful tools, built for landlords and loved by tenants." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/publicassets/LogoWB.png" />
        <meta property="og:url" content="https://mypropertypal.co.uk/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MyPropertyPal – Automate your rental business" />
        <meta name="twitter:description" content="Streamline your rental business with powerful tools, built for landlords and loved by tenants." />
        <meta name="twitter:image" content="/publicassets/LogoWB.png" />
        <link rel="canonical" href="https://mypropertypal.co.uk/" />
      </Head>
      <Landing />
    </>
  );
}