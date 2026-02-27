"use client";

import { useState } from "react";
import Link from "next/link";

// --- SVG Icons ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="3 6 5 6 21 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.08L5.6 20l1-2c.5.5 1 1 1.5 1.5C11 22 17 21 19 14c2-7-2-11-2-11s-1 3-5 4c0 0 3 0 5 5z" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

// --- Types ---
type CartItem = {
  id: number;
  name: string;
  tag: "Veg" | "Non-Veg";
  size: string;
  addons?: string;
  price: number;
  qty: number;
  img: string;
};

// --- Initial Cart Data ---
const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Butter Chicken with Naan",
    tag: "Non-Veg",
    size: "Regular",
    price: 180,
    qty: 1,
    img: "https://images.unsplash.com/photo-1604908176997-4318c6e3f4f6?w=120&h=120&fit=crop",
  },
  {
    id: 2,
    name: "Chicken Biryani",
    tag: "Non-Veg",
    size: "Half",
    addons: "Raita",
    price: 200,
    qty: 1,
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&h=120&fit=crop",
  },
];

const VALID_COUPONS: Record<string, number> = {
  FIRST50: 50,
  SAVE30: 30,
  TIFFIN20: 20,
};
// --- Cart Item Component ---
function CartItemCard({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
      {/* Image */}
      <img
        src={item.img}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{item.name}</h3>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                item.tag === "Veg"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {item.tag === "Veg" ? <LeafIcon /> : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 10 10">
                  <circle cx="5" cy="5" r="3" />
                </svg>
              )}
              {item.tag}
            </span>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-400 hover:text-red-600 transition p-1 flex-shrink-0"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="text-gray-500 text-sm mt-1">
          <span>Size: {item.size}</span>
          {item.addons && <span className="ml-2">· Add-ons: {item.addons}</span>}
        </div>

        {/* Qty + Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQtyChange(item.id, -1)}
              disabled={item.qty <= 1}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <MinusIcon />
            </button>
            <span className="text-gray-900 font-semibold w-5 text-center">{item.qty}</span>
            <button
              onClick={() => onQtyChange(item.id, 1)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
            >
              <PlusIcon />
            </button>
          </div>
          <span className="text-orange-500 font-bold text-base">
            ₹{item.price * item.qty}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleQtyChange = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setDiscount(VALID_COUPONS[code]);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      setDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCoupon("");
    setCouponError("");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - discount);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBagIcon />
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious meals to get started!</p>
        <Link
          href="/menu"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
              />
            ))}

            {/* Item count */}
            <p className="text-sm text-gray-400 pl-1">
              {cart.length} item{cart.length > 1 ? "s" : ""} in cart
            </p>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

              {/* Coupon */}
              {!appliedCoupon ? (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <TagIcon />
                      </div>
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={coupon}
                        onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{couponError}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">Try: FIRST50, SAVE30, TIFFIN20</p>
                </div>
              ) : (
                <div className="mb-5 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-between">
                  <div>
                    <span className="text-green-700 text-sm font-semibold">{appliedCoupon}</span>
                    <span className="text-green-600 text-xs ml-2">-₹{discount} off</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-red-500 transition text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Bill breakdown */}
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-500">₹{total}</span>
              </div>

              {/* Actions */}
              <div className="mt-5 space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/menu"
                  className="block w-full border border-gray-200 text-gray-700 text-center py-3 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}