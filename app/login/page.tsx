"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import api from "../lib/axios";
import chefImage from "../../public/auth-chef.png";

// Icons (consistent with signup page)
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface LoginForm {
  identifier: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isActive: boolean;
  isBlocked: boolean;
  status: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post<LoginResponse>(
        "/user/login",
        {
          identifier: form.identifier.trim(),
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (data.user) {
        dispatch(setUser(data.user));
        // Optional: localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* LEFT - Illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 overflow-hidden">
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg">
            Login to continue your
            <br />
            Healthy ReadyMealz Journey
          </p>
        </div>

        <Image
          src={chefImage}
          alt="Chef preparing homemade meal"
          priority
          className="object-contain w-4/5 max-w-[420px] lg:max-w-[480px] xl:max-w-[520px]"
          quality={85}
        />

        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-200 opacity-20 blur-3xl rounded-full" />
      </div>

      {/* RIGHT - Login Form */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-8 lg:py-12">
        <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-100 shadow-lg">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Login to Account
          </h2>

          <p className="text-center text-gray-500 text-sm sm:text-base mt-2 mb-6 sm:mb-8">
            Use your Email or Mobile Number
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl mb-6 border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {/* Identifier (Email or Mobile) */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3">
                <UserIcon />
              </span>
              <input
                type="text"
                name="identifier"
                placeholder="Email or Mobile Number"
                value={form.identifier}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400"
                required
                autoComplete="username email tel"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400 flex-1"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-orange-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <span className="text-sm font-medium">Hide</span>
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:brightness-105 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-orange-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

          {/* Optional: Forgot Password link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link href="/forgot-password" className="text-orange-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}