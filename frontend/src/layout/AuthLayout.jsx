import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectIsloogedIn } from "../features/auth/authSLice";

function AuthLayout() {
  const isLoggedIn = useSelector(selectIsloogedIn);
  return isLoggedIn ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default AuthLayout;
