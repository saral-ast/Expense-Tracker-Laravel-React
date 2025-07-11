import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSLice";
import Input from "../../component/Input";
import Button from "../../component/Button";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(registerUser(data)).unwrap();
      console.log(response)
      
      
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 w-full max-w-md space-y-6"
        noValidate
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Create Account
        </h2>

        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          register={register("name", {
            required: "Name is required",
          })}
          error={errors.name}
        />

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
              message: "Minimum 6 characters",
            },
          })}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          name="password_confirmation"
          type="password"
          placeholder="••••••••"
          register={register("password_confirmation", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.password_confirmation}
        />

        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Sign Up
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
