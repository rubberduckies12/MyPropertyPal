import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [cookiesAccepted, setCookiesAccepted] = useState(null); // Initialize as null to differentiate between no action and accepted/declined

  useEffect(() => {
    // Check if cookies have already been accepted or declined
    const consent = localStorage.getItem("cookiesAccepted");
    if (consent === "true") {
      setCookiesAccepted(true);
    } else if (consent === "false") {
      setCookiesAccepted(false);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true); // Hide the banner and enable cookies
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setCookiesAccepted(false); // Hide the banner without enabling cookies
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        {/* Meta Pixel Code - Only load if cookies are accepted */}
        {cookiesAccepted === true && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '1102746611819123');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1102746611819123&ev=PageView&noscript=1"
              />
            </noscript>
          </>
        )}
      </Head>
      <Component {...pageProps} />
      <Analytics />

      {/* Cookie Banner */}
      {cookiesAccepted === null && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white py-4 px-4 sm:px-6 shadow-lg z-50 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 animate-slide-up">
          <p className="text-sm text-center sm:text-left md:text-base flex-1">
            We use cookies to improve your experience. By accepting them, it
            really helps us to develop our app and get it in front of people
            like you. See our{" "}
            <a
              href="/privacy"
              className="underline text-white font-semibold hover:text-blue-200 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            for more info.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={handleAcceptCookies}
              className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 w-full sm:w-auto"
            >
              Accept Cookies
            </button>
            <button
              onClick={handleDeclineCookies}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 w-full sm:w-auto"
            >
              Decline Cookies
            </button>
          </div>
        </div>
      )}
    </>
  );
}
