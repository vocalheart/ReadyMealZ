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
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";
import { useCart } from "../hooks/useCart";

/**
 * Enhanced Navbar Component
 * - Mobile drawer menu from right side
 * - Orders link with badge
 * - Real-time cart counter (no click needed)
 * - Modern UI/UX improvements
 */
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [city, setCity] = useState("Detecting...");
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useCart(); // Real-time cart count
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

  // Scroll effect
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
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.location.href = "/login";
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/menu", label: "Menu", icon: FiHome },
    { href: "/orders", label: "Orders", icon: FiPackage },
    { href: "/subscribe", label: "Subscribe", icon: null },
    { href: "/bulk-order", label: "Bulk Order", icon: null },
    { href: "/features", label: "Features", icon: null },
  ];

  if (loading) return null;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white text-lg font-bold shadow-md hover:shadow-lg transition">
                🍱
              </div>
              <span className="hidden sm:block text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                ReadyMealz
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 text-sm ${
                    pathname === item.href
                      ? "text-orange-600 font-semibold"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {/* Location Badge */}
              <div className="flex items-center gap-2 rounded-full bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 border border-gray-200 transition">
                <FiMapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">
                  {city}
                </span>
              </div>

              {/* Cart Icon with Badge */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200"
              >
                <FiShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white ring-2 ring-white shadow-lg">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Auth */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
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
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/10 focus:outline-none z-50 border border-gray-100 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {user?.email || user?.mobile}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition duration-150"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiUser className="h-5 w-5" />
                          <span>My Account</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition duration-150"
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
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition duration-150"
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
                    className="rounded-lg border border-orange-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-orange-600 hover:bg-orange-50 transition duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="flex md:hidden items-center gap-3">
              {/* Location Badge - Mobile */}
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                <FiMapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span className="max-w-[70px] truncate font-medium">{city}</span>
              </div>

              {/* Mobile Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
              >
                <FiShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition focus:outline-none"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - RIGHT SIDE */}
      <div
        className={`fixed inset-y-16 right-0 z-50 w-80 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mx-4 border-t border-gray-200" />

        {/* Cart Link */}
        <div className="px-4 py-4">
          <Link
            href="/cart"
            onClick={handleNavClick}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition"
          >
            <span className="flex items-center gap-3">
              <FiShoppingCart className="h-5 w-5" />
              <span>Shopping Cart</span>
            </span>
            {itemCount > 0 && (
              <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Auth Section */}
        <div className="border-t border-gray-200 p-4 mt-4">
          {isLoggedIn ? (
            <div className="space-y-3">
              {/* User Info Card */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user?.email || user?.mobile}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Links */}
              <Link
                href="/account"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                <FiUser className="h-5 w-5" />
                <span>My Account</span>
              </Link>

              <Link
                href="/orders"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                <FiPackage className="h-5 w-5" />
                <span>My Orders</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={handleNavClick}
                className="block w-full rounded-lg border-2 border-orange-500 py-3 text-center font-medium text-orange-600 hover:bg-orange-50 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={handleNavClick}
                className="block w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-center font-medium text-white hover:shadow-lg transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;