"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiMapPin,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import api from "../lib/axios";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState<string>("Detecting...");
  const dispatch = useDispatch();

  //  Redux Auth State
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!user;

  //  AUTO DETECT USER LOCATION (Browser GPS)
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("Location Off");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          //  Reverse Geocoding (Free - OpenStreetMap)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            "Unknown";

          setCity(detectedCity);
        } catch (error) {
          setCity("Location Error");
        }
      },
      (error) => {
        // If user denies location permission
        setCity("Select Location");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  }, []);

  //  Logout
  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (err) {}

    dispatch(logoutUser());
    window.location.href = "/login";
  };

  if (loading) return null;

  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/*  LEFT: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-2 rounded-full">🍱</div>
            <h1 className="text-xl font-semibold text-gray-800">
              ReadyMealz
            </h1>
          </Link>

          {/*  DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <li>
              <Link href="/menu" className="hover:text-orange-500 transition">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/subscribe" className="hover:text-orange-500 transition">
                Subscribe
              </Link>
            </li>
            <li>
              <Link href="/bulk-order" className="hover:text-orange-500 transition">
                Bulk Order
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-orange-500 transition">
                Features
              </Link>
            </li>
          </ul>

          {/*  RIGHT SECTION (DESKTOP) */}
          <div className="hidden md:flex items-center gap-6">
            
            {/*  AUTO LOCATION */}
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <FiMapPin className="text-orange-500" />
              <span className="text-sm font-medium">{city}</span>
            </div>

            {/*  Cart */}
            <Link href="/cart" className="relative cursor-pointer">
              <FiShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </Link>

            {/* Auth Section */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Hi, {user.name}
                </span>
                <Link href="/account">
                  <FiUser
                    size={22}
                    className="cursor-pointer hover:text-orange-500"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/*  MOBILE RIGHT: Cart + Location + Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {/*  Mobile Location */}
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <FiMapPin className="text-orange-500" />
              <span className="max-w-[80px] truncate">{city}</span>
            </div>
            {/*  Cart Icon */}
            <Link href="/cart" className="relative cursor-pointer">
              <FiShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </Link>
            {/*  Menu Toggle */}
            {open ? (
              <FiX
                size={28}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            ) : (
              <FiMenu
                size={28}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
      {/*  MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col items-center gap-6 py-6 text-gray-700 font-medium">
            <li>
              <Link href="/menu" onClick={() => setOpen(false)}>
                Menu
              </Link>
            </li>
            <li>
              <Link href="/subscribe" onClick={() => setOpen(false)}>
                Subscribe
              </Link>
            </li>
            <li>
              <Link href="/bulk-order" onClick={() => setOpen(false)}>
                Bulk Order
              </Link>
            </li>
            <li>
              <Link href="/features" onClick={() => setOpen(false)}>
                Features
              </Link>
            </li>

            {/*  Location in Mobile Menu */}
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin />
              <span>{city}</span>
            </div>

            {/*  Cart */}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <FiShoppingCart />
              <span>Cart</span>
            </Link>

            {/* Auth Mobile */}
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3 w-40">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-center px-4 py-2 border border-orange-500 text-orange-500 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-center px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <FiUser />
                  <span>{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;