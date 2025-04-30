import { createBrowserRouter } from "react-router";
import GuestLayout from "../layout/GuestLayout";
import AuthLayout from "../layout/AuthLayout";
import SignUp from "../pages/Auth/SignUp";
import Dahboard from "../pages/Dahboard";
import Login from "../pages/Auth/Login";

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
        Component: Dahboard,
      },
    ],
  },
]);

export default router;
