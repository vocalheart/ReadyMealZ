"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/axios";
import chefImage from "../../public/auth-chef.png";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

/* ─── Types ─────────────────────────────────── */
interface SignupForm {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

/* ─── Main Page ──────────────────────────────── */
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

      {/* LEFT - Illustration (hidden on mobile) */}
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

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">

            {/* Name */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <User className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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
              <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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
              <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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
              <Lock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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
                className="ml-2 text-gray-400 hover:text-orange-600 transition flex-shrink-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <Lock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:brightness-105 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4 sm:my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs sm:text-sm text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
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