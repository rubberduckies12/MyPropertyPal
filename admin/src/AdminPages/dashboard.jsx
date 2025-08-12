import React, { useState, useEffect } from "react";
import { HiUsers, HiCurrencyPound, HiClipboardList, HiCash } from "react-icons/hi";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0); // Total users
  const [tasks, setTasks] = useState([]); // Recent tasks
  const [totalFinancials, setTotalFinancials] = useState(0); // Total financials
  const [monthlyIncome, setMonthlyIncome] = useState(0); // Monthly income
  const [isYearly, setIsYearly] = useState(false); // Toggle for yearly/monthly income
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Replace with your backend's base URL
        const BASE_URL = "https://api.mypropertypal.com";

        // Fetch landlord count
        const landlordResponse = await fetch(
          `${BASE_URL}/api/admin/dashboard/landlord-count`,
          {
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!landlordResponse.ok) {
          const errorText = await landlordResponse.text();
          throw new Error(`Landlord Count Error: ${errorText}`);
        }

        const landlordData = await landlordResponse.json();
        setUserCount(landlordData.landlordCount);

        // Fetch dashboard summary
        const summaryResponse = await fetch(
          `${BASE_URL}/api/admin/dashboard/dashboard-summary`,
          {
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!summaryResponse.ok) {
          const errorText = await summaryResponse.text();
          throw new Error(`Dashboard Summary Error: ${errorText}`);
        }

        const summaryData = await summaryResponse.json();
        setMonthlyIncome(summaryData.totalMonthlyIncome);
        setTasks(summaryData.recentTasks);
        setTotalFinancials(summaryData.totalMonthlyIncome); // Assuming financials = monthly income for now

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleIncomeView = () => {
    setIsYearly((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col gap-6">
      {/* Header */}
      <header className="mb-4 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of your platform's performance
        </p>
      </header>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Users Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-4">
            <HiUsers className="text-blue-500 text-4xl" />
            <h2 className="text-xl font-semibold text-gray-700">Users</h2>
          </div>
          <p className="text-4xl font-bold text-blue-600 mt-4">{userCount}</p>
        </div>

        {/* Financials Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-4">
            <HiCash className="text-purple-500 text-4xl" />
            <h2 className="text-xl font-semibold text-gray-700">Financials</h2>
          </div>
          <p className="text-4xl font-bold text-purple-600 mt-4">
            £{totalFinancials.toLocaleString()}
          </p>
        </div>

        {/* Income Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-4">
            <HiCurrencyPound className="text-yellow-500 text-4xl" />
            <h2 className="text-xl font-semibold text-gray-700">Income</h2>
          </div>
          <p className="text-4xl font-bold text-yellow-600 mt-4">
            £
            {isYearly
              ? (monthlyIncome * 12).toLocaleString()
              : monthlyIncome.toLocaleString()}
          </p>
          {/* Toggle Switch */}
          <div
            className="mt-4 flex items-center gap-2 cursor-pointer"
            onClick={toggleIncomeView}
          >
            <span
              className={`text-sm font-medium ${
                isYearly ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Monthly
            </span>
            <div
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isYearly ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span
              className={`text-sm font-medium ${
                isYearly ? "text-gray-800" : "text-gray-400"
              }`}
            >
              Yearly
            </span>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto md:mx-0">
            <HiClipboardList className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4 text-center md:text-left">
            Tasks
          </h2>
          <p className="text-4xl font-bold text-green-600 mt-2 text-center md:text-left">
            {tasks.length}
          </p>
          <ul className="mt-4 text-sm text-gray-600 w-full">
            {tasks.slice(0, 3).map((task, index) => (
              <li key={index} className="truncate">
                - {task.task_name} ({task.progress})
              </li>
            ))}
            {tasks.length > 3 && (
              <li className="text-blue-500">+ more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;