import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSLice'
import dashboardReducer from '../features/dashboard/dashboardSlice'

const store = configureStore({
    reducer: {
        auth : authReducer, 
        dashboard: dashboardReducer,   
    }, // Add your reducers here
});   

export default store;