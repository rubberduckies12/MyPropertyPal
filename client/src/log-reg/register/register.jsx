import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ROLES = [
  { label: "Landlord", value: "landlord" },
  { label: "Tenant", value: "tenant" },
];

const PLANS = [
  { label: "Basic (£30/mo or £306/yr)", value: "basic" },
  { label: "Pro (£50/mo or £510/yr)", value: "pro" },
  { label: "Organisation (£250/mo or £2550/yr)", value: "organisation" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

async function register(data) {
  const res = await fetch("https://api.mypropertypal.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Registration failed");
  return res.json();
}

function isPasswordValid(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [plan, setPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const invite = query.get("invite");
    if (invite) {
      setInviteMode(true);
      setInviteToken(invite);
      fetch(`https://api.mypropertypal.com/api/tenants/invite/${invite}`)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setRole(data.role);
        })
        .catch(() => setError("Invalid or expired invite link."));
    }
  }, [query]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    try {
      if (inviteMode) {
        await register({
          password,
          invite: inviteToken,
        });
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        await register({
          email,
          password,
          role: "landlord",
          firstName,
          lastName,
          plan_name: plan,
          billing_cycle: billingCycle,
        });

        const res = await fetch(
          "https://api.mypropertypal.com/api/stripe/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              plan_name: plan,
              billing_cycle: billingCycle,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create checkout session");

        window.location.href = data.url;
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  const handleMainBack = () => {
    window.location.href = "https://www.mypropertypal.com/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
        {/* Adjusted button positioning */}
        <button
          type="button"
          className="absolute top-6 left-6 text-blue-600 font-semibold"
          onClick={handleMainBack}
        >
          ← Back to website
        </button>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center mt-4">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form content remains unchanged */}
          {inviteMode ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Set your password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm your password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                disabled={!password || !confirmPassword}
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* Steps remain unchanged */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    disabled={!firstName || !lastName}
                  >
                    Next
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      disabled={!email}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select your plan</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    >
                      <option value="">Select a plan</option>
                      {PLANS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      disabled={!plan}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Set your password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      disabled={!password}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {step === 5 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm your password</label>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      disabled={!confirmPassword}
                    >
                      Register
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-4">{success}</div>}
      </div>
    </div>
  );
}