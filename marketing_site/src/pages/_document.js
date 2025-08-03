import { Html, Head, Main, NextScript } from "next/document";
import { useEffect, useState } from "react";

export default function Document() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Check if cookies have already been accepted
    const consent = localStorage.getItem("cookiesAccepted");
    if (consent === "true") {
      setCookiesAccepted(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);
  };

  return (
    <Html lang="en">
      <Head>
        {cookiesAccepted && (
          <>
            {/* Meta Pixel Code */}
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
                  fbq('init', '1795108854418853');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1795108854418853&ev=PageView&noscript=1"
              />
            </noscript>
            {/* End Meta Pixel Code */}
          </>
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        {!cookiesAccepted && (
          <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white py-4 px-6 shadow-lg z-50 flex justify-between items-center animate-slide-up">
            <p className="text-sm md:text-base">
              We use cookies to improve your experience. By using our site, you
              accept our use of cookies.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleAcceptCookies}
                className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-100 transition duration-300"
              >
                Accept Cookies
              </button>
              <button
                onClick={() => setCookiesAccepted(false)} // Simply hides the banner
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
              >
                Decline Cookies
              </button>
            </div>
          </div>
        )}
      </body>
    </Html>
  );
}
