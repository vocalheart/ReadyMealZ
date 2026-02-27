"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/axios";
import chefImage from "../../public/auth-chef.png"; // your image

// 🔹 Icons (SVG - lightweight & professional)
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
        throw new Error(res.data.message);
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-white to-amber-50">
      
      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="absolute top-12 left-12">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Join ReadyMealz 
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Fresh Homemade Meals<br />Delivered Daily in Bhopal
          </p>
        </div>

        <Image
          src={chefImage}
          alt="Chef Illustration"
          priority
          className="object-contain w-[80%] h-[80%]"
        />

        <div className="absolute bottom-0 w-72 h-72 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white  rounded-3xl p-8 border border-orange-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Create Account
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">
            Start your healthy meal journey 
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3"><UserIcon /></span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3"><EmailIcon /></span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
            </div>

            {/* Mobile */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3"><PhoneIcon /></span>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <EyeIcon />
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-orange-300">
              <span className="text-gray-400 mr-3"><LockIcon /></span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none text-sm"
                required
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Button */}
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

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}