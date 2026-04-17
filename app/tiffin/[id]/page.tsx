"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../lib/axios";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Clock,
  Truck,
  Leaf,
  Sprout,
  FlameKindling,
  Sun,
  Moon,
  Calendar,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  CheckCircle,
  Loader,
  AlertCircle,
  UtensilsCrossed,
  Users,
} from "lucide-react";

/* ─── Types ─────────────────────────────────── */
type TiffinData = {
  _id: string;
  name: string;
  description: string;
  htmlDescription?: string;
  image?: { url: string; key: string };
  gallery?: Array<{ url: string; key: string }>;
  pricing: {
    basePrice: number;
    currency: string;
    tiers: Array<{ name: string; price: number; discount: number }>;
  };
  service: {
    deliveryDays: string[];
    deliveryTime: { start: string; end: string };
    isAvailable: boolean;
    prepareTime: number;
    minDeliveryDistance: number;
    maxDeliveryDistance: number;
  };
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isJain: boolean;
    allergens: string[];
    noOfServings: number;
  };
  menuItems: Array<{ name: string; description: string; category: string }>;
  ratings: { average: number; totalReviews: number };
  tags: string[];
};

type Address = {
  _id: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  pincode: string;
  state: string;
  isDefault: boolean;
};

type MealTime = "lunch" | "dinner" | "both";
type PaymentMethod = "upi" | "card" | "cod";

type Plan = {
  id: string;
  label: string;
  days: number;
  pricePerMeal: number;
  totalAmount: number;
  discount: number;
  popular: boolean;
};

/* ─── Step config ───────────────────────────── */
const STEPS = ["Plan", "Timing", "Start Date", "Address", "Payment"];

/* ─── Helpers ───────────────────────────────── */
const getPlans = (basePrice: number): Plan[] => [
  { id: "15days", label: "15 Days", days: 15, pricePerMeal: basePrice, totalAmount: basePrice * 15, discount: 0, popular: false },
  { id: "30days", label: "30 Days", days: 30, pricePerMeal: basePrice, totalAmount: basePrice * 30, discount: Math.floor(basePrice * 5), popular: true },
];

const isDeliveryDay = (dateStr: string, deliveryDays: string[]) => {
  const day = new Date(dateStr).toLocaleString("en-US", { weekday: "long" });
  return deliveryDays.includes(day);
};

/* ═══════════════════════════════════════════════
   LOADING / ERROR STATES
═══════════════════════════════════════════════ */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader className="w-10 h-10 text-orange-500 animate-spin" />
  </div>
);

const PageError = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
      <Link href="/tiffin" className="mt-4 inline-block text-orange-600 font-medium text-sm hover:underline">
        ← Back to Tiffin Services
      </Link>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════════ */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-6 overflow-x-auto px-2">
      <div className="flex items-center gap-0 min-w-max">
        {STEPS.map((step, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  done ? "bg-green-500 border-green-500 text-white"
                    : active ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}>
                  {done ? <Check className="w-4 h-4" /> : idx}
                </div>
                <span className={`mt-1 text-xs font-medium hidden sm:block ${active ? "text-gray-900" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-10 h-0.5 mb-4 mx-1 ${idx < current ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ORDER SUMMARY SIDEBAR
═══════════════════════════════════════════════ */
function OrderSummary({
  tiffin, plan, mealTime, startDate,
}: {
  tiffin: TiffinData;
  plan: Plan | null;
  mealTime: MealTime | null;
  startDate: string;
}) {
  const mealMultiplier = mealTime === "both" ? 2 : 1;
  const totalMeals = plan ? plan.days * mealMultiplier : 0;
  const subtotal = plan ? plan.totalAmount * mealMultiplier : 0;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-5 sticky top-24">
      {/* Image */}
      <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-orange-100">
        {tiffin.image?.url ? (
          <img src={tiffin.image.url} alt={tiffin.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-orange-300" />
          </div>
        )}
      </div>

      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-3">{tiffin.name}</h3>

      <div className="space-y-2 text-xs sm:text-sm border-b border-orange-200 pb-3 mb-3">
        <div className="flex justify-between text-gray-600">
          <span>Plan</span>
          <span className="font-semibold text-gray-900">{plan ? `${plan.days} Days` : "—"}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Price / meal</span>
          <span className="font-semibold text-gray-900">₹{tiffin.pricing.basePrice}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Meal time</span>
          <span className="font-semibold text-gray-900 capitalize">{mealTime || "—"}</span>
        </div>
        {totalMeals > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Total meals</span>
            <span className="font-semibold text-gray-900">{totalMeals}</span>
          </div>
        )}
        {startDate && (
          <div className="flex justify-between text-gray-600">
            <span>Start date</span>
            <span className="font-semibold text-gray-900">
              {new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>
        {plan && plan.discount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount</span>
            <span>−₹{plan.discount * mealMultiplier}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-900 text-sm">Total</span>
        <span className="text-xl font-bold text-orange-600">
          {subtotal > 0 ? `₹${subtotal}` : "—"}
        </span>
      </div>

      {/* Delivery info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700 space-y-1">
        <p className="font-semibold mb-1">Delivery details</p>
        <p>Days: {tiffin.service.deliveryDays.slice(0, 3).join(", ")}{tiffin.service.deliveryDays.length > 3 ? "..." : ""}</p>
        <p>Time: {tiffin.service.deliveryTime.start} – {tiffin.service.deliveryTime.end}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 1 — SELECT PLAN
═══════════════════════════════════════════════ */
function StepPlan({ plans, selected, onSelect }: { plans: Plan[]; selected: Plan | null; onSelect: (p: Plan) => void }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Select Your Plan</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">Only 15 or 30 day plans available</p>
      <div className="space-y-3">
        {plans.map((plan) => {
          const isSelected = selected?.id === plan.id;
          return (
            <button key={plan.id} onClick={() => onSelect(plan)}
              className={`w-full text-left rounded-xl px-4 py-4 border-2 flex items-center gap-4 transition-all ${
                isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected ? "border-orange-500" : "border-gray-400"
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm sm:text-base text-gray-900">{plan.label}</span>
                  {plan.popular && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ₹{plan.pricePerMeal}/meal · Total ₹{plan.totalAmount}
                  {plan.discount > 0 && <span className="text-green-600 font-semibold"> · Save ₹{plan.discount}</span>}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 2 — MEAL TIMING
═══════════════════════════════════════════════ */
function StepTiming({ selected, onSelect }: { selected: MealTime | null; onSelect: (t: MealTime) => void }) {
  const options: { id: MealTime; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "lunch", label: "Lunch Only", desc: "Delivered by 12:30 PM", icon: <Sun className="w-5 h-5" /> },
    { id: "dinner", label: "Dinner Only", desc: "Delivered by 7:30 PM", icon: <Moon className="w-5 h-5" /> },
    { id: "both", label: "Lunch + Dinner", desc: "Both meals daily (2× count)", icon: <div className="flex gap-1"><Sun className="w-4 h-4" /><Moon className="w-4 h-4" /></div> },
  ];
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Meal Timing</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">When should we deliver your meals?</p>
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button key={opt.id} onClick={() => onSelect(opt.id)}
              className={`w-full text-left rounded-xl px-4 py-4 border-2 flex items-center gap-4 transition-all ${
                isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-white" : "border-gray-400"}`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <div className={isSelected ? "text-white" : "text-orange-500"}>{opt.icon}</div>
              <div>
                <p className={`font-semibold text-sm sm:text-base ${isSelected ? "text-white" : "text-gray-900"}`}>{opt.label}</p>
                <p className={`text-xs mt-0.5 ${isSelected ? "text-orange-100" : "text-gray-500"}`}>{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 3 — START DATE
═══════════════════════════════════════════════ */
function StepStartDate({
  deliveryDays, value, onChange,
}: { deliveryDays: string[]; value: string; onChange: (v: string) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const valid = value ? isDeliveryDay(value, deliveryDays) : false;

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Start Date</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">Pick a delivery day to begin your subscription</p>
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5">
        <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-3">
          <Calendar className="w-4 h-4 text-orange-500" /> Start Date
        </label>
        <input
          type="date"
          min={today}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
        {value && (
          <div className={`mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold ${valid ? "text-green-600" : "text-red-600"}`}>
            {valid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {new Date(value).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        )}
        {value && !valid && (
          <p className="text-xs text-red-500 mt-1 ml-6">
            Delivery available on: {deliveryDays.join(", ")}
          </p>
        )}
      </div>
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-500 font-medium mb-1">Available delivery days:</p>
        <div className="flex flex-wrap gap-1.5">
          {deliveryDays.map((d) => (
            <span key={d} className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">{d.slice(0, 3)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 4 — SELECT ADDRESS
═══════════════════════════════════════════════ */
function StepAddress({
  addresses, selected, onSelect, loading,
}: { addresses: Address[]; selected: string; onSelect: (id: string) => void; loading: boolean }) {
  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Delivery Address</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">Where should we deliver your meals?</p>
      {addresses.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">No saved addresses found</p>
          <Link href="/address" className="text-orange-600 font-semibold text-sm hover:underline">
            + Add Address
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => {
            const isSelected = selected === addr._id;
            return (
              <button key={addr._id} onClick={() => onSelect(addr._id)}
                className={`w-full text-left rounded-xl px-4 py-4 border-2 flex items-start gap-3 transition-all ${
                  isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "border-orange-500" : "border-gray-400"
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-gray-900">{addr.recipientName}</p>
                    {addr.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{addr.fullAddress}</p>
                  <p className="text-xs text-gray-500">{addr.city}, {addr.state} – {addr.pincode}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{addr.phoneNumber}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 5 — PAYMENT
═══════════════════════════════════════════════ */
function StepPayment({
  selected, onSelect, upiId, onUpiChange, transactionId, onTransactionChange,
}: {
  selected: PaymentMethod;
  onSelect: (v: PaymentMethod) => void;
  upiId: string;
  onUpiChange: (v: string) => void;
  transactionId: string;
  onTransactionChange: (v: string) => void;
}) {
  const methods: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "upi", label: "UPI / GPay / PhonePe", desc: "Pay instantly via UPI", icon: <Smartphone className="w-5 h-5" /> },
    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: <CreditCard className="w-5 h-5" /> },
    { id: "cod", label: "Cash on Delivery", desc: "Pay when meal arrives", icon: <Banknote className="w-5 h-5" /> },
  ];

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Payment Method</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">Choose how you'd like to pay</p>
      <div className="space-y-3">
        {methods.map((m) => {
          const isSelected = selected === m.id;
          return (
            <button key={m.id} onClick={() => onSelect(m.id)}
              className={`w-full text-left rounded-xl px-4 py-4 border-2 flex items-center gap-4 transition-all ${
                isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-white" : "border-gray-400"}`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <div className={isSelected ? "text-white" : "text-orange-500"}>{m.icon}</div>
              <div>
                <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-900"}`}>{m.label}</p>
                <p className={`text-xs mt-0.5 ${isSelected ? "text-orange-100" : "text-gray-500"}`}>{m.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected === "upi" && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">UPI ID</label>
            <input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => onUpiChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Transaction ID</label>
            <input type="text" placeholder="TXN123456789" value={transactionId} onChange={(e) => onTransactionChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
        </div>
      )}
      {selected === "card" && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Expiry</label>
              <input type="text" placeholder="MM/YY"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">CVV</label>
              <input type="password" placeholder="•••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Transaction ID</label>
            <input type="text" placeholder="TXN123456789" value={transactionId} onChange={(e) => onTransactionChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════════ */
function SuccessScreen({ tiffin, plan, onBack }: { tiffin: TiffinData; plan: Plan | null; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 sm:w-11 sm:h-11 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Subscription Confirmed!</h2>
        <p className="text-sm text-gray-600 mb-1">
          Your {plan?.days}-day <span className="font-semibold">{tiffin.name}</span> subscription is confirmed.
        </p>
        <p className="text-sm text-gray-500 mb-8">Fresh meals will start arriving at your doorstep soon.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders"
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition">
            View Orders
          </Link>
          <button onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            Back to Tiffin
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL VIEW (subscribe=false)
═══════════════════════════════════════════════ */
function DetailView({ tiffin, id }: { tiffin: TiffinData; id: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <Link href="/tiffin" className="inline-flex items-center gap-2 text-orange-600 text-sm font-medium mb-5 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Hero image */}
          <div className="relative h-52 sm:h-72 bg-orange-100">
            {tiffin.image?.url ? (
              <img src={tiffin.image.url} alt={tiffin.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UtensilsCrossed className="w-16 h-16 text-orange-300" />
              </div>
            )}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${tiffin.service.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
              {tiffin.service.isAvailable ? "Available" : "Unavailable"}
            </div>
            <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap">
              {tiffin.dietary.isVegetarian && (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"><Leaf className="w-3 h-3" /> VEG</span>
              )}
              {tiffin.dietary.isVegan && (
                <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"><Sprout className="w-3 h-3" /> VEGAN</span>
              )}
              {tiffin.dietary.isJain && (
                <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"><FlameKindling className="w-3 h-3" /> JAIN</span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{tiffin.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{tiffin.description}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center flex-shrink-0">
                <p className="text-2xl font-bold text-orange-600">₹{tiffin.pricing.basePrice}</p>
                <p className="text-xs text-gray-500">{tiffin.pricing.currency} / {tiffin.dietary.noOfServings} serving</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />, label: "Rating", val: `${tiffin.ratings.average || "New"}` },
                { icon: <Clock className="w-4 h-4 text-orange-500" />, label: "Prep time", val: `${tiffin.service.prepareTime} min` },
                { icon: <Users className="w-4 h-4 text-blue-500" />, label: "Servings", val: `${tiffin.dietary.noOfServings}` },
                { icon: <Truck className="w-4 h-4 text-green-500" />, label: "Delivery", val: "Free" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{s.val}</p>
                </div>
              ))}
            </div>

            {/* Delivery days */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Days</p>
              <div className="flex flex-wrap gap-2">
                {tiffin.service.deliveryDays.map((d) => (
                  <span key={d} className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">{d}</span>
                ))}
              </div>
            </div>

            {/* Menu items */}
            {tiffin.menuItems.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Menu Items</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tiffin.menuItems.map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscribe CTA */}
            <Link href={`/tiffin/${id}?subscribe=true`}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition ${
                tiffin.service.isAvailable
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-400 pointer-events-none"
              }`}
            >
              {tiffin.service.isAvailable ? <><span>Subscribe Now</span><ArrowRight className="w-4 h-4" /></> : "Currently Unavailable"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function TiffinDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const subscribe = searchParams.get("subscribe") === "true";

  /* — Data state — */
  const [tiffin, setTiffin] = useState<TiffinData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  /* — Checkout state — */
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [mealTime, setMealTime] = useState<MealTime | null>(null);
  const [startDate, setStartDate] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  /* — Fetch tiffin — */
  useEffect(() => {
    const fetch = async () => {
      try {
        setPageLoading(true);
        const res = await api.get(`/public/tiffin/${id}`);
        if (res.data.success) setTiffin(res.data.data);
        else setPageError("Tiffin not found");
      } catch {
        setPageError("Failed to load tiffin details");
      } finally {
        setPageLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* — Fetch addresses when reaching step 4 — */
  useEffect(() => {
    if (step === 4 && addresses.length === 0) {
      const fetch = async () => {
        try {
          setAddressLoading(true);
          const res = await api.get("/user/address", { withCredentials: true });
          if (res.data.success) {
            setAddresses(res.data.data || []);
            const def = res.data.data?.find((a: Address) => a.isDefault);
            if (def) setSelectedAddress(def._id);
          }
        } catch {
          /* silent */
        } finally {
          setAddressLoading(false);
        }
      };
      fetch();
    }
  }, [step]);

  /* — Validation — */
  const canContinue = () => {
    if (step === 1) return !!selectedPlan;
    if (step === 2) return !!mealTime;
    if (step === 3) return !!startDate && tiffin ? isDeliveryDay(startDate, tiffin.service.deliveryDays) : false;
    if (step === 4) return !!selectedAddress;
    if (step === 5) return !!paymentMethod;
    return true;
  };

  /* — Submit — */
  const handleSubmit = async () => {
    if (!tiffin || !selectedPlan || !mealTime || !startDate || !selectedAddress) return;
    try {
      setSubmitting(true);
      setSubmitError("");
      await api.post(
        "/tiffin/tiffin-subscription",
        {
          tiffin: tiffin._id,
          plan: {
            days: selectedPlan.days,
            pricePerMeal: selectedPlan.pricePerMeal,
            totalAmount: selectedPlan.totalAmount * (mealTime === "both" ? 2 : 1),
            discount: selectedPlan.discount,
          },
          mealTime,
          startDate,
          address: selectedAddress,
          payment: { method: paymentMethod, transactionId: transactionId || undefined },
        },
        { withCredentials: true }
      );
      setSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (step < 5) setStep(step + 1);
    else handleSubmit();
  };

  /* — Render guards — */
  if (pageLoading) return <ProtectedRoute><PageLoader /></ProtectedRoute>;
  if (pageError || !tiffin) return <ProtectedRoute><PageError message={pageError || "Tiffin not found"} /></ProtectedRoute>;
  if (success) return <ProtectedRoute><SuccessScreen tiffin={tiffin} plan={selectedPlan} onBack={() => { setSuccess(false); setStep(1); router.replace(`/tiffin/${id}`); }} /></ProtectedRoute>;
  if (!subscribe) return <ProtectedRoute><DetailView tiffin={tiffin} id={id} /></ProtectedRoute>;

  const plans = getPlans(tiffin.pricing.basePrice);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
            <button onClick={() => step > 1 ? setStep(step - 1) : router.replace(`/tiffin/${id}`)}
              className="text-gray-600 hover:text-gray-900 transition p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">Checkout</h1>
              <p className="text-xs text-gray-500">{tiffin.name}</p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto py-5 sm:py-8 px-3 sm:px-4">
          <StepIndicator current={step} />

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {/* Main card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
              {step === 1 && <StepPlan plans={plans} selected={selectedPlan} onSelect={(p) => { setSelectedPlan(p); }} />}
              {step === 2 && <StepTiming selected={mealTime} onSelect={setMealTime} />}
              {step === 3 && <StepStartDate deliveryDays={tiffin.service.deliveryDays} value={startDate} onChange={setStartDate} />}
              {step === 4 && <StepAddress addresses={addresses} selected={selectedAddress} onSelect={setSelectedAddress} loading={addressLoading} />}
              {step === 5 && (
                <StepPayment
                  selected={paymentMethod} onSelect={setPaymentMethod}
                  upiId={upiId} onUpiChange={setUpiId}
                  transactionId={transactionId} onTransactionChange={setTransactionId}
                />
              )}

              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {submitError}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex gap-3 flex-col sm:flex-row">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)}
                    className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition text-sm order-2 sm:order-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button onClick={handleContinue} disabled={!canContinue() || submitting}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition order-1 sm:order-2 ${
                    canContinue() && !submitting
                      ? "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
                      : "bg-orange-300 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : step === 5 ? (
                    <><CheckCircle className="w-4 h-4" /> Place Order</>
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <OrderSummary tiffin={tiffin} plan={selectedPlan} mealTime={mealTime} startDate={startDate} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}