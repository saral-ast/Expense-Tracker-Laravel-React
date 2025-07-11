import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, logoutApi, registerApi } from "../../service/api";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

// ✅ Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const { name, email, password, password_confirmation } = data;
      const response = await registerApi(
        name,
        email,
        password,
        password_confirmation
      );

      // Save token & user to cookies
      cookies.set("token", response.data.data.token);
      cookies.set("user", JSON.stringify(response.data.data.user));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// ✅ Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const { email, password } = data;
      const response = await loginApi(email, password);

      // Save token & user to cookies
      cookies.set("token", response.data.data.token);
      cookies.set("user", JSON.stringify(response.data.data.user));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// ✅ Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();

      // Remove cookies
      cookies.remove("token");
      cookies.remove("user");

      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    }
  }
);

// ✅ Initial State
const initialState = {
  isLoggedIn: !!cookies.get("token"),
  loading: false,
  error: null,
};

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.isLoggedIn = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Registration failed";
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state) => {
      state.loading = false;
      state.isLoggedIn = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Login failed";
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      cookies.remove("token");
      cookies.remove("user");
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Logout failed";
    });
  },
});

export default authSlice.reducer;
export const { register, login, logout ,reset } = authSlice.actions; // ✅ Export actions
export const selectIsloogedIn = (state) => state.auth.isLoggedIn;
