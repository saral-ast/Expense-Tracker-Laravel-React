import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, logoutApi, registerApi } from "../../service/api";
import { Cookies } from "react-cookie";


const cookies = new Cookies();

export const registerUser = createAsyncThunk("auth/register", async (data) => {
  const { name, email, password, password_confirmation } = data;
  const response = await registerApi(name, email, password, password_confirmation);
  return response.data.data;
});

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const { email, password } = data;
  const response = await loginApi(email, password);
  return response.data.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await logoutApi();
  cookies.remove("token");
  cookies.remove("user");
  return response.data.message;
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
   
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
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
      state.isLoggedIn = true;
    });


    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.message;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = false;
       cookies.remove("token");
       cookies.remove("user");
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