"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginForm {
  identifier: string; // email or mobile
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ✅ Proper Type for input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Proper Type for form submit
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
        }),
      });

      const data: { message?: string; token?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Optional: store token (if backend sends JWT)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ Better than window.location.href in Next.js
      router.push("/");
    } catch (err: unknown) {
      // ✅ Safe error handling (TypeScript strict)
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email OR Mobile */}
          <input
            type="text"
            name="identifier"
            placeholder="Email or Mobile Number"
            value={form.identifier}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
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
  );
}