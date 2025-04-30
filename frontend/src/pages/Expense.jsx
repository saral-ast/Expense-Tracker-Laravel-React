import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpenses,
  selectError,
  selectExpenses,
  selectLoading,
} from "../features/expense/expenseSlice";

const Expense = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-base text-gray-600 font-medium">
              Loading...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center mt-12 text-red-500 text-base font-medium">
          Error: {error}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Expenses Dashboard
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {expenses &&
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white shadow rounded-2xl p-5 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {expense.name}
                  </h2>
                  <span className="text-sm text-gray-500">{expense.date}</span>
                </div>
                <p className="text-xl font-bold text-indigo-600 mb-1">
                  ₹{expense.amount}
                </p>
                <p className="text-sm text-gray-500">
                  Group: {expense.group?.name || "N/A"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Expense;
