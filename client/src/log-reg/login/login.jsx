import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// SplashOverlay mounted globally in App.jsx

const BACKEND_URL = "https://api.mypropertypal.com";

function Login({ onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  // splash / transition states
  const [splashMounted, setSplashMounted] = useState(false); // overlay in DOM
  const [overlayOpaque, setOverlayOpaque] = useState(false); // overlay opacity
  const [showWelcome, setShowWelcome] = useState(false); // welcome text visible

  const timers = useRef([]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle inactive subscription (403 response)
        if (response.status === 403 && errorData.checkoutUrl) {
            // Redirect to Stripe Checkout
            window.location.href = errorData.checkoutUrl;
            return;
        }

        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    return () => {
      // clear any running timers on unmount
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
  }, []);

  // start splash sequence: blank white -> welcome (blue, fade) -> fade out -> navigate
  const startPostLoginSplash = (targetPath) => {
    // mount overlay
    setSplashMounted(true);

    // small delay to allow mount before starting CSS transition
    timers.current.push(
      setTimeout(() => {
        // fade overlay in (white)
        setOverlayOpaque(true);
      }, 20)
    );

    // after 1s of blank white, show welcome text (fade in)
    timers.current.push(
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000)
    );

    // after 2s total, start fading welcome out + overlay out
    timers.current.push(
      setTimeout(() => {
        setShowWelcome(false);
        setOverlayOpaque(false);
      }, 2000)
    );

    // after fade out completes (match duration below), navigate and unmount overlay
    timers.current.push(
      setTimeout(() => {
        setSplashMounted(false);
        navigate(targetPath);
      }, 2000 + 500) // 500ms matches transition duration used below
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: normalizedEmail, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response:", errorData);

            // Handle inactive subscription (403 response)
            if (response.status === 403 && errorData.checkoutUrl) {
                console.log("Redirecting to Stripe Checkout:", errorData.checkoutUrl);
                window.location.href = errorData.checkoutUrl;
                return;
            }

            throw new Error(errorData.error || 'Login failed');
        }

        const user = await response.json();
        setMessage('Login successful!');
        localStorage.setItem('token', user.token);
        localStorage.setItem('role', user.role);

        const target =
            user.role === 'tenant' || user.type === 'tenant'
                ? '/tenant-home'
                : '/dashboard';
        sessionStorage.setItem('postLoginSplashTarget', target);
        window.dispatchEvent(new Event('postLoginSplash'));
        sessionStorage.setItem('postLoginSplashStart', Date.now().toString());
        navigate(target, { replace: true });
    } catch (err) {
        console.error("Error during login:", err);
        setMessage(err.message || 'Invalid email or password.');
    }
};

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.mypropertypal.com/api/account/reset-password/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (res.ok) {
        setResetMsg("If this email exists, a reset link has been sent.");
      } else {
        setResetMsg("Unable to send reset link. Please try again.");
      }
    } catch {
      setResetMsg("Unable to send reset link. Please try again.");
    }
  };

  const handleMainBack = () => {
    window.location.href = "https://www.mypropertypal.com/";
  };

  return (
    <>
      {/* Splash overlay (mounted only during transition). Uses Tailwind for smooth fade. */}
      {splashMounted && (
        <div
          aria-hidden={!overlayOpaque && !showWelcome}
          className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-auto transition-opacity duration-500 ease-out ${
            overlayOpaque ? "opacity-100" : "opacity-0"
          } bg-white`}
        >
          {/* Welcome text container; fade in/out and scale slightly for smoothness */}
          <div
            className={`transform transition-all duration-500 ease-out ${
              showWelcome ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
            }`}
          >
            <span className="text-4xl sm:text-5xl font-extrabold text-blue-600 select-none">
              Welcome
            </span>
          </div>
        </div>
      )}

      {/* Main login UI (Tailwind classes) */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md">
          <button
            type="button"
            onClick={handleMainBack}
            className="absolute left-6 top-6 text-blue-600 font-semibold hover:text-blue-800"
          >
            ← Back
          </button>

          <img src="/publicassets/LogoWB.png" alt="MyPropertyPal Logo" className="block mx-auto mb-6 w-40" />

          {message && (
            <p className="text-red-600 text-center mb-3 text-sm">{message}</p>
          )}

          {!showReset ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Log In
                </button>
              </form>

              <div className="text-right mt-3">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2">
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Send Reset Link
                </button>
              </form>
              {resetMsg && <div className="text-blue-600 text-sm mt-3">{resetMsg}</div>}
              <button
                onClick={() => setShowReset(false)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;