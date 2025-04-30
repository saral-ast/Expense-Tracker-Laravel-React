import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout, register } from "../../service/api";
import { Cookies } from "react-cookie";


const cookies = new Cookies();

export const registerUser = createAsyncThunk("auth/register", async (data) => {
  const { name, email, password } = data;
  const response = await register(name, email, password);
  return response.data.data;
});

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const { email, password } = data;
  const response = await login(email, password);
  return response.data.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await logout();
  return response.data;
});

// export const loginUser =

const initialState = {
  isLoggedIn: !!cookies.get("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state) => {
      state.isLoggedIn = true;
    },
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.register();
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });


    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.login();
    });


    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.message;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.loading = false;
      state.logout();
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.message;
    });
  },
});


export default authSlice.reducer;
export const { register, login, logout } = authSlice.actions;
export const selectIsloogedIn = (state) => state.auth.isLoggedIn;