import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router"; // ✅ Correct import
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSLice";
import Input from "../../component/Input";
import Button from "../../component/Button";
import { selectIsloogedIn } from "../../features/auth/authSLice"; // optional

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get error from Redux state
  const authError = useSelector((state) => state.auth.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));

    // ✅ Only navigate on success
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
    form.reset(); // Reset the form after submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 w-full max-w-md space-y-6"
        noValidate
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Welcome Back
        </h2>

        {/* ✅ Global error from Redux */}
        {authError && (
          <p className="text-red-500 text-sm text-center">{authError}</p>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password}
        />

        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
