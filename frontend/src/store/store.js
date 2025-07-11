import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSLice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import groupReducer from  '../features/group/groupSlice'
import expenseReducer from '../features/expense/expenseSlice'

const store = configureStore({
  reducer: {
    auth : authReducer,
    dashboard: dashboardReducer,
    group: groupReducer,
    expense: expenseReducer,
  }, // Add your reducers here
});

export default store;  