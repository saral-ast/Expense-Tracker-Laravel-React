import React from "react";
import { useForm } from "react-hook-form";
import Input from "../../component/Input";
import Button from "../../component/Button";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSLice";

const SignUp = () => {
   const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    dispatch(registerUser(data));
    if (isLoggedIn) {
      navigate("/");
    }

  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

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
              message: "Password must be at least 6 characters",
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

        <Button type="submit" className="w-full mt-4">
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
