import { createBrowserRouter } from "react-router";
import GuestLayout from "../layout/GuestLayout";
import AuthLayout from "../layout/AuthLayout";
import SignUp from "../pages/Auth/SignUp";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Auth/Login";
import Group from "../pages/Group";
import Expense from "../pages/Expense";

const router = createBrowserRouter([
  {
    Component: GuestLayout,
    children: [
      {
        path: "/signup",
        Component: SignUp,
      },
      {
          path: "/login",
          Component: Login,
      }
    ],
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: "/",
        Component: Dashboard,
      },
      {
          path: "/groups",
          Component: Group,
      },
      {
          path: "/expenses",
          Component:Expense,
      }
    ],
  },
]);

export default router;
