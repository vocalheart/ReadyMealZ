"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import { Trash2, ShoppingCart, ArrowLeft, Loader } from "lucide-react";

/**
 * Cart Page Component
 * Displays all items in cart with ability to modify quantities and proceed to checkout
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

  useEffect(() => {
    // Fetch cart on component mount
    fetchCart();
  }, []);

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/menu"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Add some delicious meals to get started!
                </p>
                <Link
                  href="/menu"
                  className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.meal._id}
                    className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-sm transition"
                  >
                    {/* Meal Image */}
                    {item.meal.images?.[0]?.url && (
                      <img
                        src={item.meal.images[0].url}
                        alt={item.meal.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {item.meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.meal.description}
                      </p>
                      <p className="text-sm font-semibold text-orange-600 mt-2">
                        ₹{item.price} each
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.meal._id, item.quantity - 1)
                          }
                          disabled={addingItems[item.meal._id]}
                          className="text-gray-600 hover:text-gray-800 font-semibold disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.meal._id, item.quantity + 1)
                          }
                          disabled={addingItems[item.meal._id]}
                          className="text-gray-600 hover:text-gray-800 font-semibold disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Total & Delete */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{item.totalPrice}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.meal._id)}
                          disabled={addingItems[item.meal._id]}
                          className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
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

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Summary Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-gray-900">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium text-gray-900">
                      ₹{(total * 0.05).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-orange-600">
                    ₹{(total * 1.05).toFixed(2)}
                  </span>
                </div>

                {/* CTA Buttons */}
                <button className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition mb-3">
                  Proceed to Checkout
                </button>

                <button
                  onClick={clearCart}
                  className="w-full border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  Clear Cart
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/menu"
                  className="block text-center text-orange-600 hover:text-orange-700 font-medium text-sm mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}