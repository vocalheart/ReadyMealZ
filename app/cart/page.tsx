"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import {Trash2,ShoppingCart,ArrowLeft,Loader,Plus,Minus,AlertCircle,Check,TrendingDown} from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";
/**
 * Cart Page Component - Enhanced UI/UX
 * Fully responsive with mobile-first design (10px minimum text)
 */
export default function CartPage() {
  const {
    cart,
    loading,
    error,
    items,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    clearError,
    addingItems,
  } = useCart();

  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [clearedCart, setClearedCart] = useState(false);

  useEffect(() => {
    // Fetch cart on component mount
    console.log("📦 Fetching cart...");
    fetchCart();
  }, [fetchCart]);

  // Loading state
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="relative">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium text-xs sm:text-base">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  const taxAmount = parseFloat((total * 0.05).toFixed(2));
  const deliveryCharge = 40;
  const finalTotal = total + taxAmount + deliveryCharge;
  const savings = Math.floor(Math.random() * 100) + 20; // Random savings for demo

  const handleRemoveItem = async (mealId: string) => {
    setRemovingItem(mealId);
    try {
      await removeFromCart(mealId);
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
        setClearedCart(true);
        setTimeout(() => setClearedCart(false), 3000);
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition"
          >
            <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
            Back to Menu
          </Link>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            {items.length > 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm flex-shrink-0">
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  Subtotal
                </p>    
                <p className="text-lg sm:text-2xl font-bold text-orange-600">
                  ₹{total}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {clearedCart && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 animate-pulse">
            <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-green-700 font-medium">
              Cart cleared successfully!
            </p>
          </div>
        )};
        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1">
              <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 rounded-full p-4 sm:p-6">
                    <ShoppingCart className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
                  </div>
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-xs sm:text-base text-gray-600 mb-6">
                  Add some delicious meals to get started!
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-base rounded-lg hover:shadow-lg transition"
                >
                  Browse Menu
                  <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4 rotate-180" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.meal._id}
                    className={`bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden ${
                      removingItem === item.meal._id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                      {/* Meal Image */}
                      {item.meal.images?.[0]?.url && (
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.meal.images[0].url}
                            alt={item.meal.name}
                            className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg object-cover"
                          />
                          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-1 text-xs sm:text-base">
                            {item.meal.name}
                          </h3>
                          <p className="text-orange-600 font-bold text-xs sm:text-base flex-shrink-0">
                            ₹{item.totalPrice}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                          {item.meal.description}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-orange-600 mb-3">
                          ₹{item.price} each
                        </p>

                        {/* Quantity Control & Delete - Mobile */}
                        <div className="flex sm:hidden items-center justify-between">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.meal._id, item.quantity - 1)
                              }
                              disabled={addingItems[item.meal._id] || removingItem === item.meal._id}
                              className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-semibold text-gray-900 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.meal._id, item.quantity + 1)
                              }
                              disabled={addingItems[item.meal._id] || removingItem === item.meal._id}
                              className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.meal._id)}
                            disabled={addingItems[item.meal._id] || removingItem === item.meal._id}
                            className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1 disabled:opacity-50 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity Control & Delete - Desktop */}
                      <div className="hidden sm:flex flex-col items-end justify-between gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.meal._id, item.quantity - 1)
                            }
                            disabled={addingItems[item.meal._id] || removingItem === item.meal._id}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-white rounded transition disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.meal._id, item.quantity + 1)
                            }
                            disabled={addingItems[item.meal._id] || removingItem === item.meal._id}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-white rounded transition disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.meal._id)}
                          disabled={addingItems[item.meal._id] || removingItem === item.meal._id}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 sticky top-4 sm:top-24">
                <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Savings Badge */}
                {savings > 0 && (
                  <div className="mb-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-green-700 font-semibold">
                        You save ₹{savings}!
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary Breakdown */}
                <div className="space-y-2 sm:space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-gray-900">₹{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-semibold text-gray-900">₹{taxAmount}</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">
                    Total Amount
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-600">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <Link href="/checkout" className="block w-full">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition text-xs sm:text-base">
                      Proceed to Checkout
                    </button>
                  </Link>

                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="w-full border-2 border-gray-200 text-gray-700 font-medium py-2 sm:py-2.5 rounded-lg hover:bg-gray-50 transition text-xs sm:text-base disabled:opacity-50"
                  >
                    Clear Cart
                  </button>

                  <Link
                    href="/menu"
                    className="block text-center text-orange-600 hover:text-orange-700 font-medium text-xs sm:text-sm py-2 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Info */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <Check className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      Free delivery on this order! 🎉
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}