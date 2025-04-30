import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectIsloogedIn } from "../features/auth/authSLice";

function GuestLayout() {
  const isLoggedIn = useSelector(selectIsloogedIn);
  return !isLoggedIn ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/dashboard" />
  );
}

export default GuestLayout;
