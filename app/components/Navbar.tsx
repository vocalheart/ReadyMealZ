"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiMapPin,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";

function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // user dropdown
  const [city, setCity] = useState("Detecting...");
  const dispatch = useDispatch();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!user;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    } catch {}
    dispatch(logoutUser());
    window.location.href = "/login";
  };

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xl font-bold shadow-sm">
              🍱
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              ReadyMealz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8 lg:gap-10">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/subscribe", label: "Subscribe" },
              { href: "/bulk-order", label: "Bulk Order" },
              { href: "/features", label: "Features" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
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
          <div className="hidden md:flex md:items-center md:gap-6">
            {/* Location */}
            <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 text-sm font-medium text-gray-700 border border-gray-200">
              <FiMapPin className="h-4 w-4 text-orange-500" />
              <span className="max-w-[140px] truncate">{city}</span>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-1.5 transition hover:text-orange-600">
              <FiShoppingCart className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white ring-2 ring-white">
                2
              </span>
            </Link>

            {/* User Dropdown / Auth */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span className="font-medium text-gray-800 hidden lg:inline">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <FiChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 border border-gray-100">
                    <div className="py-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="h-5 w-5" />
                        My Account
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <FiLogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="flex items-center gap-4 md:hidden">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <FiMapPin className="h-4 w-4 text-orange-500" />
              <span className="max-w-[90px] truncate font-medium">{city}</span>
            </div>

            <Link href="/cart" className="relative p-1">
              <FiShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white">
                2
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-1 text-gray-700 focus:outline-none"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-screen py-6 opacity-100" : "max-h-0 py-0 opacity-0"
        } bg-white border-t border-gray-100 shadow-md`}
      >
        <div className="mx-auto max-w-md px-6 flex flex-col items-center gap-6 text-gray-800 font-medium">
          {[
            { href: "/menu", label: "Menu" },
            { href: "/subscribe", label: "Subscribe" },
            { href: "/bulk-order", label: "Bulk Order" },
            { href: "/features", label: "Features" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-lg transition ${
                pathname === item.href ? "text-orange-600 font-semibold" : "hover:text-orange-600"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="w-full h-px bg-gray-200 my-2" />

          <div className="flex items-center gap-2 text-gray-700">
            <FiMapPin className="h-5 w-5 text-orange-500" />
            <span className="font-medium">{city}</span>
          </div>

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-lg"
          >
            <FiShoppingCart className="h-5 w-5" />
            <span>Cart</span>
          </Link>

          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-4 w-full pt-2">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 text-lg"
              >
                <FiUser className="h-5 w-5" />
                <span>{user?.name || "My Account"}</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 text-lg text-red-600"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full rounded-lg border border-orange-500 py-3 text-center font-medium text-orange-600 hover:bg-orange-50 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="w-full rounded-lg bg-orange-600 py-3 text-center font-medium text-white hover:bg-orange-700 transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;