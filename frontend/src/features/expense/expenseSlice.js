import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createExpenseApi,
  deleteExpenseApi,
  getExpensesApi,
  updateExpenseApi,
} from "../../service/api";

// Fetch all expenses
export const getExpenses = createAsyncThunk("expense/getExpenses", async () => {
  const response = await getExpensesApi();
  return response.data.data;
});

// Add a new expense
export const addExpense = createAsyncThunk(
  "expense/addExpense",
  async ({ name, amount, date, group_id }) => {
    const response = await createExpenseApi(name, amount, date, group_id);
    return response.data.data;
  }
);

// Update an existing expense
export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async ({ id, name, amount, date, group_id }) => {
    const response = await updateExpenseApi(id, name, amount, date, group_id);
    return response.data.data;
  }
);

// Delete an expense
export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (id) => {
    const response = await deleteExpenseApi(id);
    return response.data.data;
  }
);

const initialState = {
  expenses: [],
  expense: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    getExpense: (state, action) => {
      const expense = state.expenses.find(
        (expense) => expense.id === action.payload.id
      );
      if (expense) {
        state.expense = expense;
      } else {
        state.expense = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getExpenses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses = action.payload.expenses;
    });

    builder.addCase(getExpenses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

    builder.addCase(addExpense.fulfilled, (state, action) => {
      state.loading = false;
      if (state.expenses === null) {
        state.expenses = []; // Initialize expenses as an empty array if it was null
      }
      state.expenses.push(action.payload.expense);
    });

    builder.addCase(addExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

    builder.addCase(updateExpense.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.expenses.findIndex(
        (expense) => expense.id === action.payload.expense.id
      );
      if (index !== -1) {
        state.expenses[index] = action.payload.expense;
      }
    });

    builder.addCase(updateExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      state.loading = false;
       state.expenses = state.expenses.filter((expense) => (
        expense.id !== parseInt(action.payload.id)
      ));
    });

    builder.addCase(deleteExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });
  },
});

export const { getExpense } = expenseSlice.actions;

export const selectExpenses = (state) => state.expense.expenses;
export const selectExpense = (state) => state.expense.expense;
export const selectLoading = (state) => state.expense.loading;
export const selectError = (state) => state.expense.error;

export default expenseSlice.reducer;
