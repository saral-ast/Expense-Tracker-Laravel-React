import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectIsloogedIn } from "../features/auth/authSLice";
import Navbar from "../component/NavBar";

function GuestLayout() {
  const isLoggedIn = useSelector(selectIsloogedIn);
  return !isLoggedIn ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}

export default GuestLayout;
