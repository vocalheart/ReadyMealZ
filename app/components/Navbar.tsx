"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiMapPin,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

function Navbar() {
  const [open, setOpen] = useState(false);

  // 🔐 Future: replace with real auth state (JWT/cookies)
  const isLoggedIn = false;

  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-2 rounded-full">
              🍱
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              ReadyMealz
            </h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <li>
              <Link href="/menu" className="hover:text-orange-500 transition">
                Menu
              </Link>
            </li>
            <li>
              <Link
                href="/subscribe"
                className="hover:text-orange-500 transition"
              >
                Subscribe
              </Link>
            </li>
            <li>
              <Link
                href="/bulk-order"
                className="hover:text-orange-500 transition"
              >
                Bulk Order
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="hover:text-orange-500 transition"
              >
                Features
              </Link>
            </li>
          </ul>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Location */}
            <div className="flex items-center gap-1 text-gray-600">
              <FiMapPin />
              <span>Bhopal</span>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative cursor-pointer">
              <FiShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </Link>

            {/* 🔐 Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link href="/account">
                <FiUser size={20} className="cursor-pointer" />
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            {open ? (
              <FiX
                size={26}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            ) : (
              <FiMenu
                size={26}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin />
              <span>Bhopal</span>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <FiShoppingCart />
              <span>Cart</span>
            </Link>

            {/*Mobile Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3 w-40">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-center px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <FiUser />
                <span>Profile</span>
              </Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
export default Navbar;