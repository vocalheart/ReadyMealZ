"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/axios";
import chefImage from "../../public/auth-chef.png"; // your image

// Icons (kept your SVGs)
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2h-1C8 21 3 16 3 9V5z" />
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

interface SignupForm {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/user/signup", form);

      if (!res.data.success) {
        throw new Error(res.data.message || "Signup failed");
      }

      // Optional: you might want to use cookies or redux here instead of localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* LEFT - Illustration Section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 overflow-hidden">
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Join ReadyMealz
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg">
            Fresh Homemade Meals
            <br />
            Delivered Daily in Bhopal
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

      {/* RIGHT - Form Section */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-8 lg:py-12">
        <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-100 shadow-lg">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Create Account
          </h2>
          <p className="text-center text-gray-500 text-sm sm:text-base mt-2 mb-6 sm:mb-8">
            Start your healthy meal journey today
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3"><UserIcon /></span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3"><EmailIcon /></span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400"
                required
              />
            </div>

            {/* Mobile */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3"><PhoneIcon /></span>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400 flex-1"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <EyeIcon />
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <span className="text-gray-400 mr-3"><LockIcon /></span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none text-sm sm:text-base placeholder:text-gray-400"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:brightness-105 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4 sm:my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs sm:text-sm text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Button (placeholder – implement real OAuth later) */}
            <button
              type="button"
              className="w-full border border-gray-200 py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition text-sm sm:text-base font-medium disabled:opacity-50"
              disabled
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}