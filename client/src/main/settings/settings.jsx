import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isCanceling, setIsCanceling] = useState(false);
  const [activeTab, setActiveTab] = useState("account"); // Manage active section

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
        setNewEmail(data.email || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        alert("Failed to load user data. Please try refreshing the page.");
      }
    };

    fetchUserData();
  }, []);

  // Update email
  const handleSaveEmail = async () => {
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newEmail }),
    });

    if (res.ok) {
      setEmail(newEmail);
      setEditingEmail(false);
      alert("Email updated successfully!");
    } else {
      alert("Failed to update email.");
    }
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing cycle.")) {
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
      });

      if (res.ok) {
        alert("Subscription canceled successfully.");
        setPlan("canceled");
      } else {
        alert("Failed to cancel subscription.");
      }
    } catch (err) {
      console.error("Error canceling subscription:", err);
      alert("An error occurred while canceling the subscription.");
    } finally {
      setIsCanceling(false);
    }
  };

  if (!email) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-gray-100 min-h-screen ml-[270px]">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex justify-center items-center bg-gray-100 min-h-screen ml-[270px]">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "account" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "subscription" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setActiveTab("subscription")}
            >
              Subscription
            </button>
          </div>

          {/* Render Active Section */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Email Section */}
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
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6">

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
          )}
        </div>
      </main>
    </div>
  );
}