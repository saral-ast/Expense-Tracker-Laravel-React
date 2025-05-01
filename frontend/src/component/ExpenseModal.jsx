import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addExpense, updateExpense } from "../features/expense/expenseSlice";
import { selectGroups, getGroups } from "../features/group/groupSlice";
import { compose } from "@reduxjs/toolkit";

const ExpenseModal = ({ isOpen, onClose, expense = null }) => {
  const dispatch = useDispatch();
  const groups = useSelector(selectGroups);
  const isEditMode = !!expense;

  console.log("ExpenseModal groups", groups);
  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      name: expense?.name || "",
      amount: expense?.amount || "",
      date: expense?.date || getCurrentDate(),
      group_id: expense?.group?.id || "",
    },
  });

  // Fetch groups when modal opens
  useEffect(() => {
    console.log("ExpenseModal useEffect", isOpen, groups.length);
    if (isOpen && groups.length === 0) {
      dispatch(getGroups());
    }
  }, [isOpen, dispatch, groups.length]);

  // Reset form when modal opens or expense changes
  useEffect(() => {
    if (isOpen && expense) {
      // Reset form with expense data when editing
      reset({
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
        group_id: expense.group?.id || "",
      });
    } else if (isOpen && !expense) {
      // Reset form when adding new expense
      reset({
        name: "",
        amount: "",
        date: getCurrentDate(), // Use today's date instead of empty string
        group_id: "",
      });
    }
  }, [isOpen, expense, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await dispatch(
          updateExpense({
            id: expense.id,
            name: data.name,
            amount: data.amount,
            date: data.date,
            group_id: data.group_id,
          })
        ).unwrap();
      } else {
        await dispatch(
          addExpense({
            name: data.name,
            amount: data.amount,
            date: data.date,
            group_id: data.group_id,
          })
        ).unwrap();
      }
      reset();
      onClose();
    } catch (error) {
      setError("name", {
        type: "manual",
        message:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} expense`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode ? "Edit Expense" : "Add New Expense"}
          </h3>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expense Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Expense name is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter expense name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0,
                  message: "Amount must be greater than 0",
                },
              })}
              className={`w-full px-3 py-2 border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register("date", {
                required: "Date is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.date && (
              <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="group_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Group
            </label>
            <select
              id="group_id"
              {...register("group_id", {
                required: "Group is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.group_id ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a group</option>
              {groups &&
                groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
            </select>
            {errors.group_id && (
              <p className="mt-2 text-sm text-red-600">
                {errors.group_id.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Expense"
                : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
