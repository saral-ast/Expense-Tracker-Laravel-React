import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../../service/api";
// Import expense actions
import { addExpense, updateExpense, deleteExpense } from "../expense/expenseSlice";

export const getDashboard = createAsyncThunk("auth/register", async () => {
  const response = await dashboardApi();
  return response.data.data;
});



// export const loginUser =

const initialState = {
  totalExpenses: 0,
  highestExpense: 0,
  totalThisMonth: 0,
  recentExpenses: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard", // Fixed the name to match the slice
  initialState,
  reducers: {
    // Add a custom reducer to handle expense deletion from group deletion
    expenseDeleted: (state, action) => {
      const deletedId = parseInt(action.payload.id);
      
      // Find the expense in recentExpenses
      const index = state.recentExpenses.findIndex(exp => exp.id === deletedId);
      
      if (index !== -1) {
        const deletedExpense = state.recentExpenses[index];
        const amount = parseFloat(deletedExpense.amount);
        
        // Update total expenses
        state.totalExpenses -= amount;
        
        // Check if expense is from current month and update totalThisMonth
        const currentDate = new Date();
        const expenseDate = new Date(deletedExpense.date);
        if (expenseDate.getMonth() === currentDate.getMonth() && 
            expenseDate.getFullYear() === currentDate.getFullYear()) {
          state.totalThisMonth -= amount;
        }
        
        // Remove from recent expenses
        state.recentExpenses = state.recentExpenses.filter(exp => exp.id !== deletedId);
        
        // Recalculate highest expense if needed
        if (amount === state.highestExpense) {
          // Find the new highest expense
          state.highestExpense = state.recentExpenses.reduce(
            (max, exp) => Math.max(max, parseFloat(exp.amount)), 0
          );
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDashboard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getDashboard.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;

        state.totalExpenses = action.payload.total_expenses;
        state.highestExpense = action.payload.highest_expense;
        state.totalThisMonth = action.payload.total_this_month;
        state.recentExpenses = action.payload.recent_expenses || [];
    });

    builder.addCase(getDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });
    
    // Update dashboard when a new expense is added
    builder.addCase(addExpense.fulfilled, (state, action) => {
      const newExpense = action.payload.expense;
      
      // Update total expenses
      state.totalExpenses += parseFloat(newExpense.amount);
      
      // Update highest expense if needed
      if (parseFloat(newExpense.amount) > state.highestExpense) {
        state.highestExpense = parseFloat(newExpense.amount);
      }
      
      // Check if expense is from current month and update totalThisMonth
      const currentDate = new Date();
      const expenseDate = new Date(newExpense.date);
      if (expenseDate.getMonth() === currentDate.getMonth() && 
          expenseDate.getFullYear() === currentDate.getFullYear()) {
        state.totalThisMonth += parseFloat(newExpense.amount);
      }
      
      // Add to recent expenses (limit to 5)
      state.recentExpenses = [newExpense, ...state.recentExpenses.slice(0, 4)];
    });
    
    // Update dashboard when an expense is updated
    builder.addCase(updateExpense.fulfilled, (state, action) => {
      const updatedExpense = action.payload.expense;
      
      // Find the expense in recentExpenses
      const index = state.recentExpenses.findIndex(exp => exp.id === updatedExpense.id);
      
      if (index !== -1) {
        // Calculate the difference in amount
        const oldAmount = parseFloat(state.recentExpenses[index].amount);
        const newAmount = parseFloat(updatedExpense.amount);
        const amountDifference = newAmount - oldAmount;
        
        // Update total expenses
        state.totalExpenses += amountDifference;
        
        // Update highest expense if needed
        if (newAmount > state.highestExpense) {
          state.highestExpense = newAmount;
        }
        
        // Check if expense is from current month and update totalThisMonth
        const currentDate = new Date();
        const oldExpenseDate = new Date(state.recentExpenses[index].date);
        const newExpenseDate = new Date(updatedExpense.date);
        
        const oldIsCurrentMonth = oldExpenseDate.getMonth() === currentDate.getMonth() && 
                                 oldExpenseDate.getFullYear() === currentDate.getFullYear();
        const newIsCurrentMonth = newExpenseDate.getMonth() === currentDate.getMonth() && 
                                newExpenseDate.getFullYear() === currentDate.getFullYear();
        
        if (oldIsCurrentMonth && newIsCurrentMonth) {
          // Both dates in current month, just update the amount difference
          state.totalThisMonth += amountDifference;
        } else if (!oldIsCurrentMonth && newIsCurrentMonth) {
          // Moved into current month, add the new amount
          state.totalThisMonth += newAmount;
        } else if (oldIsCurrentMonth && !newIsCurrentMonth) {
          // Moved out of current month, subtract the old amount
          state.totalThisMonth -= oldAmount;
        }
        
        // Update the expense in recentExpenses
        state.recentExpenses[index] = updatedExpense;
      }
    });
    
    // Update dashboard when an expense is deleted
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      const deletedId = parseInt(action.payload.id);
      
      // Find the expense in recentExpenses
      const index = state.recentExpenses.findIndex(exp => exp.id === deletedId);
      
      if (index !== -1) {
        const deletedExpense = state.recentExpenses[index];
        const amount = parseFloat(deletedExpense.amount);
        
        // Update total expenses
        state.totalExpenses -= amount;
        
        // Check if expense is from current month and update totalThisMonth
        const currentDate = new Date();
        const expenseDate = new Date(deletedExpense.date);
        if (expenseDate.getMonth() === currentDate.getMonth() && 
            expenseDate.getFullYear() === currentDate.getFullYear()) {
          state.totalThisMonth -= amount;
        }
        
        // Remove from recent expenses
        state.recentExpenses = state.recentExpenses.filter(exp => exp.id !== deletedId);
        
        // Recalculate highest expense if needed
        if (amount === state.highestExpense) {
          // Find the new highest expense
          state.highestExpense = state.recentExpenses.reduce(
            (max, exp) => Math.max(max, parseFloat(exp.amount)), 0
          );
        }
      }
    });
  },
});

// Export the custom reducer action
export const { expenseDeleted } = dashboardSlice.actions;
export default dashboardSlice.reducer;


