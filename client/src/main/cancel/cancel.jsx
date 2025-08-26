import React, { useState, useEffect } from "react";

const Cancel = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch the user's email from localStorage or sessionStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Handle checkout initiation
  const handleCheckout = async () => {
    if (!email) {
      setError("Email is required to initiate checkout.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_name: "basic", // Default plan, adjust as needed
          billing_cycle: "monthly", // Default billing cycle, adjust as needed
          email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to initiate checkout.");
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (err) {
      setError(err.message || "An error occurred while initiating checkout.");
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!email) {
      setError("Email is required to delete the account.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete the account.");
      }

      // Redirect to the home page after successful deletion
      window.location.href = "https://www.mypropertypal.com/";
    } catch (err) {
      setError(err.message || "An error occurred while deleting the account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Payment Canceled
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Your payment was canceled. To continue using our services, please
          complete the checkout process.
        </p>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Allow editing
          />
        </div>
        <button
          onClick={handleCheckout}
          className={`w-full px-4 py-2 text-white font-medium rounded-md transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Redirecting to Checkout..." : "Retry Checkout"}
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full mt-4 px-4 py-2 text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;