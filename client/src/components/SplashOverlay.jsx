import React, { useEffect, useRef, useState } from "react";

/*
  Global overlay that runs once after login.
  Uses sessionStorage.postLoginSplashTarget set by the login page.
*/
export default function SplashOverlay() {
  const [active, setActive] = useState(false);
  const [overlayOpaque, setOverlayOpaque] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const runSplash = () => {
    // avoid running twice
    if (active) return;
    setActive(true);

    clearTimers();

    // Slight mount delay
    timers.current.push(setTimeout(() => setOverlayOpaque(true), 20));

    // Show "Welcome" after 1.2s (longer blank pause)
    timers.current.push(setTimeout(() => setShowWelcome(true), 1200));

    // Keep welcome visible for 1.4s, then begin fade out
    timers.current.push(
      setTimeout(() => {
        setShowWelcome(false);
        setOverlayOpaque(false);
      }, 1200 + 1400)
    );

    // After fade completes (700ms), clear and unmount
    timers.current.push(
      setTimeout(() => {
        sessionStorage.removeItem("postLoginSplashTarget");
        sessionStorage.removeItem("postLoginSplashStart");
        setActive(false);
      }, 1200 + 1400 + 700)
    );
  };

  useEffect(() => {
    // Run on initial mount if sessionStorage flag present (covers refresh)
    if (sessionStorage.getItem("postLoginSplashTarget")) {
      runSplash();
    }
    // Also listen for a same-tab event dispatched by login to run immediately
    window.addEventListener("postLoginSplash", runSplash);
    return () => {
      window.removeEventListener("postLoginSplash", runSplash);
      clearTimers();
    };
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden={!overlayOpaque && !showWelcome}
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-700 ease-out ${
        overlayOpaque ? "opacity-100" : "opacity-0"
      } bg-white`}
    >
      <div
        className={`transform transition-all duration-700 ease-out ${
          showWelcome ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"
        }`}
      >
        <span className="text-4xl sm:text-5xl font-extrabold text-blue-600 select-none">
          Welcome
        </span>
      </div>
    </div>
  );
}