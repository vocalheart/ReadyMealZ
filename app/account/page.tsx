"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setUser, logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";

// React Icons
import { FaUserEdit, FaLock, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

// Toastify
import { toast } from "react-toastify";

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
        toast.success("Profile updated successfully!", {
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
        toast.success("Password changed successfully!", {
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
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg sm:text-xl">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-6 sm:p-8 border border-orange-100 order-1 lg:order-none">
            <div className="flex flex-col items-center text-center">
              {user.name ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <FaUserCircle className="w-24 h-24 sm:w-28 sm:h-28 text-orange-500" />
              )}

              <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                {user.name || "User"}
              </h2>

              <p className="mt-1 text-sm sm:text-base text-gray-600 break-all">
                {user.email}
              </p>

              <span className="mt-3 px-4 py-1 text-xs sm:text-sm bg-orange-100 text-orange-700 rounded-full font-medium">
                {user.role || "User"}
              </span>

              <button
                onClick={() => setEditMode(!editMode)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-medium transition text-sm sm:text-base"
              >
                <FaUserEdit />
                {editMode ? "Cancel Edit" : "Edit Profile"}
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-xl font-medium transition text-sm sm:text-base"
              >
                <FaLock />
                Change Password
              </button>
            </div>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-6 sm:p-8 border border-orange-100 order-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 font-medium mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              {/* <div>
                <label className="block text-xs sm:text-sm text-gray-600 font-medium mb-1.5">
                  Account Role
                </label>
                <div className="p-3 text-sm sm:text-base bg-gray-100 border border-gray-300 rounded-xl text-gray-800 font-medium">
                  {user.role || "—"}
                </div>
              </div> */}
            </div>

            {editMode && (
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="mt-8 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition text-sm sm:text-base disabled:opacity-60"
              >
                {saving ? "Updating..." : "Save Changes"}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="mt-5 w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition text-sm sm:text-base"
            >
              <FaSignOutAlt />
              Logout Account
            </button>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FaLock className="text-orange-600" />
              Change Password
            </h2>

            <div className="space-y-5">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition"
              />

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-medium transition text-sm sm:text-base disabled:opacity-60"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>

                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 rounded-xl font-medium transition text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}