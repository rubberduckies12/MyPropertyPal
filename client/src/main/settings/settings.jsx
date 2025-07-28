import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [plan, setPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [landlordId, setLandlordId] = useState(null); // New state for landlord_id
  const [isCanceling, setIsCanceling] = useState(false);

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/account/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to fetch user data:", errorData);
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await res.json();
        console.log("Received user data:", data);

        setEmail(data.email || "");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPlan(data.plan || "basic");
        setBillingCycle(data.billingCycle || "monthly");
        setSubscriptionId(data.subscriptionId || null);
        setLandlordId(data.landlordId || null); // Store landlord_id
        setNewEmail(data.email || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        alert("Failed to load user data. Please try refreshing the page.");
      }
    };

    fetchUserData();
  }, []);

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing cycle.")) {
      return;
    }

    if (!subscriptionId) {
      alert("No active subscription found to cancel. Please email billing@mypropertypal.com if there are any issues canceling your subscription from this page.");
      return;
    }

    setIsCanceling(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/subscriptions/cancel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (res.ok) {
        alert("Subscription canceled. You will retain access until the end of your billing cycle. If you have any issues, please email billing@mypropertypal.com.");
        setPlan("canceled"); // Update UI to reflect cancellation
      } else {
        const data = await res.json();
        alert(`${data.error || "Failed to cancel subscription."} Please email billing@mypropertypal.com if there are any issues.`);
      }
    } catch (err) {
      alert("An error occurred while canceling the subscription. Please email billing@mypropertypal.com for assistance.");
    } finally {
      setIsCanceling(false);
    }
  };

  // Update email
  const handleSaveEmail = async () => {
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email: newEmail,
        password: null,
        plan: null,
        landlordId, // Include landlord_id in the request
      }),
    });
    if (res.ok) {
      setEmail(newEmail);
      setEditingEmail(false);
    } else {
      alert("Failed to update email");
    }
  };

  // Update plan
  const handlePlanChange = async (newPlan) => {
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password: null,
        plan: newPlan,
        landlordId, // Include landlord_id in the request
      }),
    });
    if (res.ok) {
      setPlan(newPlan);
      alert("Plan updated successfully!");
    } else {
      alert("Failed to update plan");
    }
  };

  if (!email) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-gray-100 min-h-screen">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Account Settings</h1>
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center gap-4 mt-1">
                {editingEmail ? (
                  <>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={handleSaveEmail}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      onClick={() => setEditingEmail(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setEditingEmail(true)}
                    >
                      Change
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <div className="flex gap-4 mt-1">
                <select
                  name="plan"
                  value={plan}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="organisation">Organisation</option>
                  <option value="canceled">Canceled</option>
                </select>
                <select
                  name="billing"
                  value={billingCycle}
                  disabled
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Cancel Subscription Button */}
            <button
              type="button"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={handleCancelSubscription}
              disabled={isCanceling}
            >
              {isCanceling ? "Canceling..." : "Cancel Subscription"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}