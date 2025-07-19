import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./register.css";

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

// Update register function to use Render backend
async function register(data) {
  const res = await fetch('https://mypropertypal-3.onrender.com/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
  return res.json();
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [propertyId, setPropertyId] = useState(""); // <-- use propertyId instead of landlordId
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const [plan, setPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const invite = query.get("invite");
    if (invite) {
      setInviteMode(true);
      setInviteToken(invite);
      fetch(`https://mypropertypal-3.onrender.com/api/tenants/invite/${invite}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
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
    try {
      if (inviteMode) {
        // Only invited tenants can register as tenant
        await register({
          password,
          invite: inviteToken,
        });
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        // Landlord: create Stripe Checkout Session
        const res = await fetch('https://mypropertypal-3.onrender.com/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            password,
            role: "landlord",
            plan_name: plan,
            billing_cycle: billingCycle,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create checkout session");
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  // Add this function for the main back button
  const handleMainBack = () => {
    window.location.href = "https://my-property-pal-ucto.vercel.app/";
  };

  return (
    <div className="register-root">
      <div className="register-popup">
        <button
          type="button"
          className="register-main-back"
          style={{
            position: "absolute",
            left: 24,
            top: 24,
            background: "none",
            border: "none",
            color: "#2563eb",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer"
          }}
          onClick={handleMainBack}
        >
          ← Back
        </button>
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label>Hi, what's your name?</label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
              <button type="button" onClick={handleNext} disabled={!firstName || !lastName}>Next</button>
            </>
          )}
          {step === 2 && (
            <>
              <label>Enter your email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext} disabled={!email}>Next</button>
            </>
          )}
          {step === 3 && (
            <>
              <label>Select your plan</label>
              <select value={plan} onChange={e => setPlan(e.target.value)} required>
                <option value="">Select a plan</option>
                {PLANS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <div className="register-billing-toggle">
                <button
                  type="button"
                  className={billingCycle === "monthly" ? "active" : ""}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={billingCycle === "yearly" ? "active" : ""}
                  onClick={() => setBillingCycle("yearly")}
                >
                  Yearly
                </button>
              </div>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext} disabled={!plan}>Next</button>
            </>
          )}
          {step === 4 && (
            <>
              <label>Set your password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext} disabled={!password}>Next</button>
            </>
          )}
          {step === 5 && (
            <>
              <label>Confirm your password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit" disabled={!confirmPassword}>Register</button>
            </>
          )}
        </form>
        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}
      </div>
    </div>
  );
}