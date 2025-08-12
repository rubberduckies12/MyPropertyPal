import React, { useState, useEffect } from "react";
import { HiUsers, HiCurrencyPound, HiClipboardList, HiCash } from "react-icons/hi";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0); // Total users
  const [tasks, setTasks] = useState([]); // Recent tasks
  const [totalFinancials, setTotalFinancials] = useState(0); // Total financials
  const [monthlyIncome, setMonthlyIncome] = useState(0); // Monthly income
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch landlord count
        const landlordResponse = await fetch(
          "/api/admin/dashboard/landlord-count",
          {
            credentials: "include", // Include cookies for authentication
          }
        );
        const landlordData = await landlordResponse.json();
        setUserCount(landlordData.landlordCount);

        // Fetch dashboard summary
        const summaryResponse = await fetch(
          "/api/admin/dashboard/dashboard-summary",
          {
            credentials: "include", // Include cookies for authentication
          }
        );
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Header */}
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of your platform's performance
        </p>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center sm:text-left">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <HiUsers className="text-blue-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Users</h2>
          <p className="text-4xl sm:text-5xl font-bold text-blue-600 mt-2">
            {userCount}
          </p>
        </div>

        {/* Tasks Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center sm:text-left">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <HiClipboardList className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Tasks</h2>
          <p className="text-4xl sm:text-5xl font-bold text-green-600 mt-2">
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

        {/* Financials Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center sm:text-left">
          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
            <HiCash className="text-purple-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            Financials
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-purple-600 mt-2">
            ${totalFinancials.toLocaleString()}
          </p>
        </div>

        {/* Income Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center sm:text-left">
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
            <HiCurrencyPound className="text-yellow-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Income</h2>
          <p className="text-4xl sm:text-5xl font-bold text-yellow-600 mt-2">
            ${monthlyIncome.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;