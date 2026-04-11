"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setUser, logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";
import { toast } from "react-toastify";
import {User,Mail, Phone,Lock,LogOut,Edit2,Save,X,Eye,EyeOff,Shield,CheckCircle,AlertCircle,Loader} from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";
interface UpdateForm {
  name: string;
  email: string;
  mobile: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState<UpdateForm>({
    name: "",
    email: "",
    mobile: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", { withCredentials: true });

        if (res.data?.success) {
          const fetchedUser = res.data.user;
          dispatch(setUser(fetchedUser));

          setForm({
            name: fetchedUser.name || "",
            email: fetchedUser.email || "",
            mobile: fetchedUser.mobile || "",
          });
        }
      } catch (error) {
        router.push("/login");
      }
    };

    if (!user) {
      fetchProfile();
    } else {
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [dispatch, router, user]);

  // Protect Route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const res = await api.put(
        "/user/profile",
        {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        setEditMode(false);
        toast.success("Profile updated successfully! ✓", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Profile update failed";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warn("New passwords do not match", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.put(
        "/user/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success("Password changed successfully! ✓", {
          position: "top-right",
          autoClose: 4000,
        });
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Password change failed";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Logout failed", {
        position: "top-right",
        autoClose: 4000,
      });
    }

    dispatch(logoutUser());
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-xs sm:text-base">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-8 sm:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Manage your profile and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* PROFILE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-lg sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-orange-100">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                {user.name ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="w-20 h-20 sm:w-24 sm:h-24 text-orange-500" />
                )}

                {/* Name */}
                <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {user.name || "User"}
                </h2>

                {/* Email */}
                <p className="mt-2 text-xs sm:text-sm text-gray-600 break-all">
                  {user.email}
                </p>

                {/* Role Badge */}
                <div className="mt-4 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full border border-orange-200">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold capitalize">
                    {user.role || "User"}
                  </span>
                </div>

                {/* Account Status */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Account Active</span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 transform active:scale-95 ${
                    editMode
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg"
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  {editMode ? "Cancel Edit" : "Edit Profile"}
                </button>

                {/* Change Password Button */}
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 transform active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 transform active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 md:p-8 border border-orange-100">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  Account Information
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {editMode ? "Edit your details below" : "Your personal details"}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                {editMode && (
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 disabled:opacity-60 transform active:scale-95"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Security
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Manage your account security
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        Password
                      </p>
                      <p className="text-xs text-gray-600">
                        Last changed 90 days ago
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-200 transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Change Password
                </h2>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Enter your current password and a new password to update your account security
            </p>

            {/* Form Fields */}
            <div className="space-y-4 sm:space-y-5 mb-4 sm:mb-6">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((p) => ({
                        ...p,
                        current: !p.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((p) => ({
                        ...p,
                        new: !p.new,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((p) => ({
                        ...p,
                        confirm: !p.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 disabled:opacity-60 transform active:scale-95"
              >
                {passwordLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 transform active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}