import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../features/dashboard/dashboardSlice";
import { getExpenses } from "../features/expense/expenseSlice";
import { getGroups } from "../features/group/groupSlice";
import ExpenseDistributionChart from "../component/charts/ExpenseDistributionChart";
import MonthlyExpenseChart from "../component/charts/MonthlyExpenseChart";
import TopExpensesChart from "../component/charts/TopExpensesChart";
import ExportButton from "../component/ExportButton";

const Dashboard = () => {

  const dispatch = useDispatch();
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Dashboard data from dashboard slice
  const {
    totalExpenses,
    highestExpense,
    totalThisMonth,
    recentExpenses,
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector((state) => state.dashboard);

  const expenses = useSelector((state) => state.expense.expenses);
  const groups = useSelector((state) => state.group.groups);

  // Loading states from expense and group slices
  const { loading: expenseLoading } = useSelector((state) => state.expense);
  const { loading: groupLoading } = useSelector((state) => state.group);

  // Loading state combined
  const loading = dashboardLoading || expenseLoading || groupLoading;

  useEffect(() => {
    // Only fetch dashboard data if we don't have any data yet
      if(totalExpenses === 0 && !recentExpenses.length) {
        console.log("Fetching dashboard data..." , totalExpenses, recentExpenses, highestExpense, totalThisMonth);
        dispatch(getDashboard());
      }

    
    if (!expenses) {
      dispatch(getExpenses());
    }
    
    if (!groups) {
      dispatch(getGroups());
    }
    // Remove the problematic dependencies that cause re-renders
  }, [dispatch]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedExpenses = recentExpenses && recentExpenses.length > 0 
    ? [...recentExpenses].sort((a, b) => {
        if (sortConfig.key === "amount") {
          return sortConfig.direction === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        return 0;
      })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-base text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="text-center mt-12 text-red-500 text-base font-medium">
        Error: {dashboardError}
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
          Expense Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <ExportButton filters={{}} />{" "}
          {/* You can pass filters here if needed */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Total Expenses */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-indigo-600">
                  Total Expenses
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalExpenses}
                </p>
              </div>
            </div>
          </div>

          {/* Highest Expense */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-indigo-600">
                  Highest Expense
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  ${highestExpense}
                </p>
              </div>
            </div>
          </div>

          {/* Total This Month */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-indigo-600">
                  Total This Month
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalThisMonth}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <ExpenseDistributionChart />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <MonthlyExpenseChart />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <TopExpensesChart />
          </div>
        </div>

        {/* Recent Expenses Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Expenses
          </h2>

          {sortedExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort("amount")}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Amount
                      {sortConfig.key === "amount" && (
                        <span className="ml-1 text-indigo-500 font-semibold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th
                      onClick={() => handleSort("date")}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Date
                      {sortConfig.key === "date" && (
                        <span className="ml-1 text-indigo-500 font-semibold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Group
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${expense.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {expense.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {expense.group?.name || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                No recent expenses found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;