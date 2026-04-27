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
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";
import { useCart } from "../hooks/useCart";
import Image from "next/image";
import logo from "../../publiC/logoreadymealz.jpeg";

function Navbar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen]         = useState(false);
  const [city, setCity]                         = useState("Detecting...");
  const [isScrolled, setIsScrolled]             = useState(false);

  const dispatch    = useDispatch();
  const pathname    = usePathname();
  const router      = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { itemCount }     = useCart();
  const isLoggedIn        = !!user;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) { setCity("Location unavailable"); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          const data = await res.json();
          setCity(
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.state_district ||
            data.address?.state ||
            "Unknown"
          );
        } catch { setCity("Couldn't detect"); }
      },
      () => setCity("Location off"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  const handleLogout = async () => {
    try { await api.post("/user/logout", {}, { withCredentials: true }); }
    catch (err) { console.error("Logout error:", err); }
    dispatch(logoutUser());
    setMobileDrawerOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  const navItems = [
    { href: "/menu",           label: "Meals",           icon: FiHome      },
    { href: "/tiffinservices", label: "Tiffin Services", icon: FiPackage   },
    { href: "/bulk-order",     label: "Bulk Order",      icon: FiTrendingUp },
  ];

  if (loading) return null;

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src={logo} width={52} alt="A1Meals Logo" priority />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 group ${
                      isActive
                        ? "text-orange-600 bg-orange-50 font-semibold"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                    {/* Active underline */}
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">

              {/* Location pill — same style as orders page info chips */}
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 border border-gray-200 hover:border-orange-300 transition-all duration-200 cursor-pointer">
                <FiMapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span className="max-w-[110px] truncate">{city}</span>
              </div>

              {/* Cart */}
              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-200 transition-all duration-200"
                >
                  <FiShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white ring-2 ring-white shadow-md">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User dropdown */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 border border-gray-200 hover:border-orange-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    aria-expanded={dropdownOpen}
                  >
                    {/* Avatar — same gradient as orders page orange accent */}
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-gray-800 hidden lg:inline text-sm">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <FiChevronDown
                      className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown panel — matches orders page card style */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50 border border-gray-200 overflow-hidden">
                      {/* Header band */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-orange-50 to-white">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Logged in as
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {user?.email || user?.mobile}
                        </p>
                      </div>

                      <div className="py-1">
                        {[
                          { href: "/account", icon: FiUser,    label: "My Account"           },
                          { href: "/orders",  icon: FiPackage, label: "My Orders"             },
                          { href: "/tiffin",  icon: FiPackage, label: "My Tiffin Subscription"},
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors border-l-2 border-transparent hover:border-orange-500"
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span>{label}</span>
                          </Link>
                        ))}

                        <div className="my-1 mx-3 border-t border-gray-100" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-l-2 border-transparent hover:border-red-500"
                        >
                          <FiLogOut className="h-4 w-4" />
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
                    className="rounded-lg border border-orange-400 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm hover:shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="flex md:hidden items-center gap-2">
              {/* Location chip */}
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                <FiMapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span className="max-w-[55px] truncate font-medium">{city}</span>
              </div>

              {/* Cart */}
              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="relative p-1.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-200 transition-all duration-200"
                >
                  <FiShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[9px] font-bold text-white ring-2 ring-white shadow-md">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="p-1.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-all duration-200"
                aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              >
                {mobileDrawerOpen
                  ? <FiX className="h-5 w-5" />
                  : <FiMenu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer (LEFT, full height) ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-2xl border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-out md:hidden ${
          mobileDrawerOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header — same gradient pattern as orders page header */}
        <div className="sticky top-0 bg-gradient-to-br from-orange-50 to-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Menu</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Hi{user?.name ? `, ${user.name.split(" ")[0]}` : " there"}!
              </p>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-orange-100 text-gray-600 border border-gray-200 hover:border-orange-300 transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nav items — same active style as orders page filter pills */}
        <div className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon     = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-orange-600" : "text-gray-500"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth / user section — same card style as orders page */}
        <div className="border-t border-gray-200 mx-3 pt-4 pb-4 space-y-2">
          {isLoggedIn ? (
            <>
              {/* User card — same as orders page total-orders chip style */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || user?.mobile}</p>
                  </div>
                </div>
              </div>

              {[
                { href: "/account", icon: FiUser,    label: "My Account"            },
                { href: "/orders",  icon: FiPackage, label: "My Orders"              },
                { href: "/tiffin",  icon: FiPackage, label: "My Tiffin Subscription" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-transparent hover:border-orange-200 font-medium transition-all duration-200"
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  {label}
                </Link>
              ))}

              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200"
                >
                  <FiLogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="block w-full rounded-lg border border-orange-400 py-3 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileDrawerOpen(false)}
                className="block w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-center text-sm font-semibold text-white shadow-sm hover:shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Location footer */}
        <div className="border-t border-gray-100 p-4 mt-auto">
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <FiMapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-orange-600">{city}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;