"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import api from "../lib/axios";
import chefImage from "../../public/auth-chef.png";
import { User, Lock, Eye, EyeOff, X, Mail, KeyRound, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

/* ─── Types ─────────────────────────────────── */
interface LoginForm {
  identifier: string;
  password: string;
}

interface UserType {
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
  user?: UserType;
}

// Forgot password steps
type ForgotStep = "email" | "otp" | "newPassword" | "success";

/* ─── Default export wrapped in Suspense ──── */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

/* ─── Inner Page (useSearchParams safe here) ─── */
function LoginPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useDispatch();

  const [form,         setForm]         = useState<LoginForm>({ identifier: "", password: "" });
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Forgot password dialog ──
  const [dialogOpen, setDialogOpen] = useState(false);

  // Open dialog if URL has ?forgot=true
  useEffect(() => {
    if (searchParams.get("forgot") === "true") setDialogOpen(true);
  }, [searchParams]);

  const openDialog  = () => {
    setDialogOpen(true);
    // update URL param
    const params = new URLSearchParams(window.location.search);
    params.set("forgot", "true");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    // remove URL param
    const params = new URLSearchParams(window.location.search);
    params.delete("forgot");
    const q = params.toString();
    router.replace(q ? `?${q}` : window.location.pathname, { scroll: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await api.post<LoginResponse>(
        "/user/login",
        { identifier: form.identifier.trim(), password: form.password },
        { withCredentials: true }
      );
      const data = res.data;
      if (!data.success) throw new Error(data.message || "Login failed");
      if (data.user) dispatch(setUser(data.user));
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

      {/* LEFT — Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 overflow-hidden">
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg">
            Login to continue your<br />Healthy ReadyMealz Journey
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

      {/* RIGHT — Login Form */}
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
            {/* Identifier */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300 transition">
              <User className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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
              <Lock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
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
                className="ml-2 text-gray-400 hover:text-orange-600 transition flex-shrink-0"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:brightness-105 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-orange-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500 mt-4">
            <button
              onClick={openDialog}
              className="text-orange-500 hover:underline bg-transparent border-none cursor-pointer"
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>

      {/* ── FORGOT PASSWORD DIALOG ── */}
      {dialogOpen && (
        <ForgotPasswordDialog onClose={closeDialog} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FORGOT PASSWORD DIALOG
═══════════════════════════════════════════════ */
function ForgotPasswordDialog({ onClose }: { onClose: () => void }) {
  const [step,        setStep]        = useState<ForgotStep>("email");
  const [email,       setEmail]       = useState("");
  const [otp,         setOtp]         = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  // ── Step 1: Send OTP ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await api.post("/user/public/forgot-password", { email: email.trim() });
      if (res.data.success) setStep("otp");
      else throw new Error(res.data.message);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP → go to new password ──
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter valid 6-digit OTP"); return; }
    setError("");
    setStep("newPassword");
  };

  // ── Step 3: Reset password ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPass) { setError("Passwords do not match"); return; }
    try {
      setLoading(true);
      const res = await api.put("/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (res.data.success) setStep("success");
      else throw new Error(res.data.message);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Step labels
  const steps: ForgotStep[] = ["email", "otp", "newPassword"];
  const stepIndex = steps.indexOf(step);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dialog */}
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp">

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Reset Password</h2>
            <p className="text-orange-100 text-xs mt-0.5">
              {step === "email"       && "Enter your registered email"}
              {step === "otp"         && `OTP sent to ${email}`}
              {step === "newPassword" && "Set your new password"}
              {step === "success"     && "Password updated!"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Step indicator (not shown on success) */}
        {step !== "success" && (
          <div className="px-6 pt-5 pb-2 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i < stepIndex
                    ? "bg-green-500 text-white"
                    : i === stepIndex
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {i < stepIndex ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded transition-all ${i < stepIndex ? "bg-green-400" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 pb-7">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition">
                  <Mail size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full outline-none text-sm placeholder:text-gray-400"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:brightness-105 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send OTP <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Enter OTP
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  We sent a 6-digit OTP to <strong className="text-orange-600">{email}</strong>
                </p>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition">
                  <KeyRound size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full outline-none text-sm tracking-[0.3em] font-mono placeholder:tracking-normal placeholder:text-gray-400"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:brightness-105 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                Verify OTP <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="w-full text-xs text-gray-500 hover:text-orange-600 transition"
              >
                ← Change email
              </button>
            </form>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition">
                  <Lock size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full outline-none text-sm placeholder:text-gray-400 flex-1"
                    required
                    minLength={6}
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="ml-2 text-gray-400 hover:text-orange-500 transition">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                <div className={`flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-300 transition ${
                  confirmPass && confirmPass !== newPassword ? "border-red-300" : "border-gray-300 focus-within:border-orange-400"
                }`}>
                  <Lock size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full outline-none text-sm placeholder:text-gray-400 flex-1"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="ml-2 text-gray-400 hover:text-orange-500 transition">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPass && confirmPass !== newPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPass}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:brightness-105 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          {/* ── STEP 4: Success ── */}
          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Password Reset!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been updated successfully.
                You can now login with your new password.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:brightness-105 transition"
              >
                Back to Login
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Slide up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { transform: translateY(20px) scale(0.97); opacity: 0; }
            to   { transform: translateY(0)    scale(1);    opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}