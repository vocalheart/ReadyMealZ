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
import Image from "next/image";
import logo from '../../public/logoreadymealz.jpeg';

/**
 * Enhanced Navbar Component - Updated
 * - Mobile drawer opens from LEFT side
 * - Cart & Orders visible only when logged in
 * - Mobile drawer full viewport height
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
  const { itemCount } = useCart();
  const isLoggedIn = !!user;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
    { href: "/menu", label: "Meals", icon: FiHome },
    // ...(isLoggedIn ? [{ href: "/orders", label: "Orders", icon: FiPackage }] : []),
    { href: "/tiffinservices", label: "Tiffin Services", icon: FiTrendingUp },
    { href: "/bulk-order", label: "Bulk Order", icon: FiTrendingUp },
    // { href: "/features", label: "Features", icon: FiHelpCircle },
  ];

  if (loading) return null;

  return (
    <>
      {/* ─── Main Navbar ──────────────────────────────────────────────── */}
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
              <Image src={logo} width={60} alt="A1Meals Logo" priority />
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
              {/* Location */}
              <div className="flex items-center gap-2 rounded-full bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 border border-gray-200 transition-all duration-200 cursor-pointer hover:border-orange-300">
                <FiMapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{city}</span>
              </div>
              {/* Cart - only when logged in */}
              {isLoggedIn && (
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
              )}
              {/* User Dropdown / Auth */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-gray-800 hidden lg:inline text-sm">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <FiChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/10 z-50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                        <p className="text-xs text-gray-500 font-semibold">LOGGED IN AS</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">{user?.email || user?.mobile}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-150 border-l-2 border-l-transparent hover:border-l-orange-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiUser className="h-5 w-5" /> <span>My Account</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-150 border-l-2 border-l-transparent hover:border-l-orange-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiPackage className="h-5 w-5" /> <span>My Orders</span>
                        </Link>

                        <div className="my-2 border-t border-gray-100" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 border-l-2 border-l-transparent hover:border-l-red-600"
                        >
                          <FiLogOut className="h-5 w-5" /> <span>Logout</span>
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
              {/* Location (mobile) */}
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                <FiMapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span className="max-w-[60px] truncate font-medium">{city}</span>
              </div>

              {/* Cart - mobile - only logged in */}
              {isLoggedIn && (
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
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 focus:outline-none"
                aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              >
                {mobileDrawerOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Drawer (LEFT SIDE + FULL HEIGHT) ──────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-2xl border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-out md:hidden transform ${
          mobileDrawerOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={handleDrawerClose}
              className="p-2 rounded-full hover:bg-orange-100 text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Hi{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!</p>
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
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-l-4 border-orange-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-orange-400"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth / User Section */}
        <div className="border-t border-gray-200 mt-4 p-4">
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email || user?.mobile}</p>
                  </div>
                </div>
              </div>

              <Link
                href="/account"
                onClick={handleDrawerClose}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <FiUser className="h-5 w-5" /> My Account
              </Link>

              <Link
                href="/orders"
                onClick={handleDrawerClose}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <FiPackage className="h-5 w-5" /> My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-200 border border-red-200 hover:border-red-400 mt-4"
              >
                <FiLogOut className="h-5 w-5" /> Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                href="/login"
                onClick={handleDrawerClose}
                className="block w-full rounded-xl border-2 border-orange-500 py-3.5 text-center font-semibold text-orange-600 hover:bg-orange-50 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={handleDrawerClose}
                className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-center font-semibold text-white hover:shadow-lg transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Location footer */}
        <div className="border-t border-gray-200 p-5 mt-auto">
          <p className="text-sm text-gray-600 text-center">
            📍 You are in <span className="font-semibold text-orange-600">{city}</span>
          </p>
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;