import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpenses,
  selectError,
  selectExpenses,
  selectLoading,
} from "../features/expense/expenseSlice";
import ExpenseModal from "../component/ExpenseModal";
import DeleteExpenseModal from "../component/DeleteExpenseModal";

const Expense = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  const handleOpenModal = (expense = null) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const handleOpenDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Expense List
          </h1>
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Expense
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-screen">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {expenses &&
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
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
                        {expense.name}
                      </h2>
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹{expense.amount}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">{expense.date}</span>
                        <span className="text-xs text-gray-500">Group: {expense.group?.name || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenModal(expense)}
                      className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                      title="Edit Expense"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(expense)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Expense"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {expenses && expenses.length === 0 && (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No expenses available</p>
          </div>
        )}
      </div>
      {/* Modals */}
      <ExpenseModal isOpen={isModalOpen} onClose={handleCloseModal} expense={selectedExpense} />
      <DeleteExpenseModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} expense={selectedExpense} />
    </div>
  );
};

export default Expense;
