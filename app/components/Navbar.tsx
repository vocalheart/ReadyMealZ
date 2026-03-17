"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiMapPin,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiPackage,
  FiHome,
  FiTrendingUp,
  FiHelpCircle,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";
import { useCart } from "../hooks/useCart";

/**
 * Enhanced Navbar Component
 * ✅ Mobile drawer opens from RIGHT side
 * ✅ Orders link added with badge
 * ✅ Real-time cart counter (no click needed)
 * ✅ Instant fetch after login
 * ✅ Modern UI/UX improvements
 */
function Navbar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [city, setCity] = useState("Detecting...");
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useCart(); // ✅ Real-time cart count from Redux
  const isLoggedIn = !!user;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Location detection
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("Location unavailable");
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();

        const detected =
          data.address?.city ||
          data.address?.town ||
          data.address?.suburb ||
          data.address?.state_district ||
          data.address?.state ||
          "Unknown";

        setCity(detected);
      } catch {
        setCity("Couldn't detect");
      }
    };

    const handleError = () => setCity("Location off");

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    dispatch(logoutUser());
    setMobileDrawerOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const navItems = [
    { href: "/menu", label: "Menu", icon: FiHome },
    { href: "/orders", label: "Orders", icon: FiPackage },
    { href: "/subscribe", label: "Subscribe", icon: FiTrendingUp },
    { href: "/bulk-order", label: "Bulk Order", icon: FiTrendingUp },
    { href: "/features", label: "Features", icon: FiHelpCircle },
  ];

  if (loading) return null;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white text-lg font-bold shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
                🍱
              </div>
              <span className="hidden sm:block text-lg sm:text-xl font-bold tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors">
                ReadyMealz
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 text-sm relative group ${
                    pathname === item.href
                      ? "text-orange-600 font-semibold"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ${
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {/* Location Badge */}
              <div className="flex items-center gap-2 rounded-full bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 border border-gray-200 transition-all duration-200 cursor-pointer hover:border-orange-300">
                <FiMapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">
                  {city}
                </span>
              </div>

              {/* Cart Icon with Badge - UPDATED */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
              >
                <FiShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white ring-2 ring-white shadow-lg animate-pulse">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Auth */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-gray-800 hidden lg:inline text-sm">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <FiChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/10 focus:outline-none z-50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                        <p className="text-xs text-gray-500 font-semibold">
                          LOGGED IN AS
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {user?.email || user?.mobile}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-150 border-l-2 border-l-transparent hover:border-l-orange-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiUser className="h-5 w-5" />
                          <span>My Account</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-150 border-l-2 border-l-transparent hover:border-l-orange-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiPackage className="h-5 w-5" />
                          <span>My Orders</span>
                        </Link>

                        <div className="my-2 border-t border-gray-100" />

                        <button
                          onClick={() => {
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 border-l-2 border-l-transparent hover:border-l-red-600"
                        >
                          <FiLogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-lg border border-orange-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-orange-600 hover:bg-orange-50 transition-all duration-200 hover:border-orange-600"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="flex md:hidden items-center gap-3">
              {/* Location Badge - Mobile */}
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                <FiMapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span className="max-w-[60px] truncate font-medium">{city}</span>
              </div>

              {/* Mobile Cart Icon - UPDATED */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
              >
                <FiShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white ring-2 ring-white shadow-lg animate-pulse">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle - RIGHT SIDE */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 focus:outline-none"
                aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              >
                {mobileDrawerOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - OPENS FROM RIGHT SIDE */}
      <div
        className={`fixed inset-y-16 right-0 z-50 w-72 sm:w-80 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto transition-all duration-300 ease-out md:hidden transform ${
          mobileDrawerOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <p className="text-xs text-gray-600 mt-1">Quick navigation</p>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleDrawerClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-l-4 border-orange-600"
                    : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent hover:border-orange-400"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
                {item.href === "/orders" && isLoggedIn && (
                  <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mx-4 border-t border-gray-200" />

        {/* Cart Link - PROMINENT */}
        <div className="px-4 py-4">
          <Link
            href="/cart"
            onClick={handleDrawerClose}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold hover:shadow-md transition-all duration-200 border border-orange-200 hover:border-orange-400 transform hover:scale-105"
          >
            <span className="flex items-center gap-3">
              <FiShoppingCart className="h-5 w-5" />
              <span>Shopping Cart</span>
            </span>
            {itemCount > 0 && (
              <span className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Auth Section */}
        <div className="border-t border-gray-200 p-4 mt-4">
          {isLoggedIn ? (
            <div className="space-y-4">
              {/* User Info Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email || user?.mobile}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Links */}
              <Link
                href="/account"
                onClick={handleDrawerClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 font-medium transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <FiUser className="h-5 w-5 flex-shrink-0" />
                <span>My Account</span>
              </Link>

              <Link
                href="/orders"
                onClick={handleDrawerClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 font-medium transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <FiPackage className="h-5 w-5 flex-shrink-0" />
                <span>My Orders</span>
                <span className="ml-auto text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full">
                  Track
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-200 border border-red-200 hover:border-red-400 transform hover:scale-105"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={handleDrawerClose}
                className="block w-full rounded-lg border-2 border-orange-500 py-3 text-center font-semibold text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:scale-105"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={handleDrawerClose}
                className="block w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-center font-semibold text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-200 p-4 mt-4">
          <p className="text-xs text-gray-600 text-center">
            📍 You are in <span className="font-semibold text-orange-600">{city}</span>
          </p>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileDrawerOpen(false)}
          role="presentation"
        />
      )}
    </>
  );
}

export default Navbar;