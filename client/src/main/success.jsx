import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17437964703/myjyCJqPioAbEJ_ziPtA',
        'value': 1.0,
        'currency': 'GBP',
        'transaction_id': ''
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m0 0a9 9 0 11-6 0 9 9 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2563eb] mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for subscribing to MyPropertyPal. Your account has been updated.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-[#2563eb] text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition mb-4"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => (window.location.href = "https://app.mypropertypal.com/")}
            className="w-full px-6 py-3 bg-gray-100 text-[#2563eb] font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}