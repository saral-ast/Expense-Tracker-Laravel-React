import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../../service/api";




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
  name: "auth",
  initialState,
  reducers: {},
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
        state.recentExpenses = action.payload.recent_expenses;
    });

    builder.addCase(getDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

},
});

export default dashboardSlice.reducer;


