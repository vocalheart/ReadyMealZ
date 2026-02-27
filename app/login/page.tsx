"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/axios";
import chefImage from "../../public/auth-chef.png"; // same image as signup

interface LoginForm {
  identifier: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// 🔹 Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 3l18 18" />
    <path d="M10.584 10.587A3 3 0 0013.414 13.417" />
    <path d="M9.878 5.878A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.132 5.411" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

      const res = await api.post<LoginResponse>("/user/login", {
        identifier: form.identifier,
        password: form.password,
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/"); // redirect to home/dashboard
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-white to-amber-50">
      
      {/*  LEFT IMAGE SECTION (Same as Signup - Branding Consistency) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        
        <div className="absolute top-12 left-12">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Welcome Back 
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Login to continue your<br />
            Healthy ReadyMealz Journey 
          </p>
        </div>

        <Image
          src={chefImage}
          alt="ReadyMealz Login"
          priority
          className="object-contain w-[80%] h-[80%]"
        />

        <div className="absolute bottom-0 w-72 h-72 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>
      </div>

      {/*  RIGHT LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white  rounded-3xl p-8 border border-orange-100">
          
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Login to Account
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">
            Use Email or Mobile to login
          </p>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Identifier */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3">
                <UserIcon />
              </span>
              <input
                type="text"
                name="identifier"
                placeholder="Email or Mobile Number"
                value={form.identifier}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-orange-500"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Button UI */}
            <button
              type="button"
              className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-orange-500 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}