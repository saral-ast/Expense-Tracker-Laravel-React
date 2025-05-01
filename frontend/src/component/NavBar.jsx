import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { selectIsloogedIn } from "../features/auth/authSLice";
import { logoutUser } from "../features/auth/authSLice";
import { Cookies } from "react-cookie";

const Navbar = () => {
  const isLoggedIn = useSelector(selectIsloogedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const user = cookies.get("user") || null;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    cookies.remove("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center text-indigo-600 text-xl font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Expense Tracker
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  Welcome, {user?.name || "User"}
                </span>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600 hover:text-indigo-600 font-medium"
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/groups"
                  className={({ isActive }) =>
                    `text-sm font-medium px-3 py-2 rounded-md transition ${
                      isActive
                        ? "text-indigo-600 font-medium"
                        : "text-gray-600 hover:text-indigo-600 font-medium"
                    }`
                  }
                >
                  Groups
                </NavLink>
                <NavLink
                  to="/expenses"
                  className={({ isActive }) =>
                    `text-sm font-medium px-3 py-2 rounded-md transition ${
                      isActive
                        ? "text-indigo-600 font-medium"
                        : "text-gray-600 hover:text-indigo-600 font-medium"
                    }`
                  }
                >
                  Expenses
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-white  text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-medium px-3 py-2 rounded-md transition ${
                      isActive
                        ? " text-indigo-600 font-medium"
                        : "text-gray-600 hover:text-indigo-600 font-medium"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `text-sm font-medium px-3 py-2 rounded-md transition ${
                      isActive
                        ? "text-indigo-600 font-medium"
                        : "text-gray-600 hover:text-indigo-600 font-medium"
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  Welcome, {user?.name || "User"}
                </span>
                <NavLink
                  to="/"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/groups"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >Groups</NavLink>
                <NavLink
                  to="/expenses"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Expenses
                  </NavLink>
                  

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium px-3 py-2 rounded-md transition ${
                      isActive
                        ? "text-indigo-700 bg-indigo-100"
                        : "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium px-4 py-2 rounded-md shadow transition ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white"
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
