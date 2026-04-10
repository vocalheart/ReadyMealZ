"use client";

import api from ".././lib/axios";
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Clock,
  Shield,
  Check,
  ChevronDown,
  Star,
  TrendingUp,
  Zap,
  Award,
  Target,
  Sparkles,
  CreditCard,
  Lock,
  ArrowRight,
} from "lucide-react";

/* ─── Razorpay type declaration ─────────────── */
declare global {
  interface Window {
    Razorpay: any;
  }
}

/* ─── Types ─────────────────────────────────── */
interface BulkImage {
  _id: string;
  url: string;
  key: string;
}

interface BulkOrder {
  _id: string;
  name: string;
  description?: string;
  price: number;
  minQuantity?: number;
  maxQuantity?: number;
  category?: string;
  preparationTime?: number;
  isAvailable?: boolean;
  imageUrl: BulkImage[];
  createdAt: string;
}

/* ─── Load Razorpay script dynamically ──────── */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ─── Image Slider ───────────────────────────── */
function ImageSlider({ images, name }: { images: BulkImage[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % images.length),
      3000
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  const go = (dir: "prev" | "next") => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent((p) =>
      dir === "prev"
        ? (p - 1 + images.length) % images.length
        : (p + 1) % images.length
    );
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % images.length),
      3000
    );
  };

  if (!images.length)
    return (
      <div className="h-48 sm:h-52 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center rounded-t-lg sm:rounded-t-2xl">
        <span className="text-4xl sm:text-5xl">🍽️</span>
      </div>
    );

  return (
    <div className="relative h-48 sm:h-52 rounded-t-lg sm:rounded-t-2xl overflow-hidden group">
      {images.map((img, i) => (
        <img
          key={img._id}
          src={img.url}
          alt={`${name} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <>
          <button
            onClick={() => go("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => go("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "bg-white w-3" : "bg-white/50 w-1.5"
                }`}
              />
            ))}
          </div>
          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {current + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}

/* ─── Quote Dialog (2-STEP MOBILE OPTIMIZED) ─────────────────────── */
function QuoteDialog({
  order,
  onClose,
}: {
  order: BulkOrder;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    eventDate: "",
    quantity: "",
    requirements: "",
  });

  // step: "step1" | "step2" | "paying" | "success"
  const [step, setStep] = useState<"step1" | "step2" | "paying" | "success">("step1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Holds quoteId returned after first submit (pre-payment)
  const [pendingQuoteId, setPendingQuoteId] = useState<string | null>(null);

  const set = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const estimatedTotal =
    form.quantity && !isNaN(Number(form.quantity))
      ? order.price * Number(form.quantity)
      : null;

  const EVENT_TYPES = [
    "Corporate Event",
    "Wedding",
    "Birthday Party",
    "College Fest",
    "Office Lunch",
    "Religious Gathering",
    "Other",
  ];

  const inp =
    "w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white transition";

  /* ── Step 1 Validation ── */
  const isStep1Valid = form.name && form.email && form.phone && form.eventType && form.eventDate;

  /* ── Step 2 Validation ── */
  const isStep2Valid = form.quantity && !isNaN(Number(form.quantity));

  /* ── Move to Step 2 ── */
  const handleStep1Next = () => {
    if (!isStep1Valid) {
      setError("Please fill all required fields in Step 1");
      return;
    }
    setError("");
    setStep("step2");
  };

  /* ── Go back to Step 1 ── */
  const handleStep2Back = () => {
    setError("");
    setStep("step1");
  };

  /* ── Step 2: Submit form → get quoteId → create Razorpay order ── */
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid) {
      setError("Please fill quantity");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️  Save the quote to DB
      const quoteRes = await api.post("/bulk-quotes/submit", {
        bulkOrderId: order._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        eventType: form.eventType,
        eventDate: form.eventDate,
        quantity: Number(form.quantity),
        requirements: form.requirements,
      });

      if (!quoteRes.data.success) {
        setError(quoteRes.data.message || "Failed to save quote.");
        setLoading(false);
        return;
      }

      const quoteId = quoteRes.data.data?._id || quoteRes.data.quoteId;
      if (!quoteId) {
        setError("Could not retrieve quote ID from server.");
        setLoading(false);
        return;
      }

      setPendingQuoteId(quoteId);

      // 2️  Create Razorpay order
      const orderRes = await api.post("/bulk/create-order", { quoteId });

      if (!orderRes.data.success) {
        setError(orderRes.data.message || "Failed to create payment order.");
        setLoading(false);
        return;
      }

      const { razorpayOrder } = orderRes.data;

      // 3️  Load Razorpay SDK and open checkout
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setError("Payment gateway failed to load. Please try again.");
        setLoading(false);
        return;
      }

      setStep("paying");
      setLoading(false);

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // set in your .env
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Bulk Order",
        description: order.name,
        order_id: razorpayOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#f97316" },

        /* ── Payment success handler ── */
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await api.post("/bulk/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setStep("success");
            } else {
              setStep("step2");
              setError(
                verifyRes.data.message ||
                  "Payment verification failed. Contact support."
              );
            }
          } catch {
            setStep("step2");
            setError("Payment verification failed. Please contact support.");
          }
        },

        /* ── Dialog dismissed without payment ── */
        modal: {
          ondismiss: () => {
            setStep("step2");
            setError(
              "Payment was cancelled. Please complete payment to confirm your order."
            );
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-2xl my-6 shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg sm:rounded-t-2xl z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {step === "paying" ? "Complete Payment" : step === "step2" ? "Order Details" : "Request a Quote"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              For:{" "}
              <span className="text-orange-500 font-medium">{order.name}</span>
            </p>
          </div>
          {/* Don't allow close while Razorpay is open */}
          {step !== "paying" && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ── Order summary strip ── */}
        <div className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg sm:rounded-xl flex items-center gap-3">
          {order.imageUrl?.[0]?.url && (
            <img
              src={order.imageUrl[0].url}
              alt={order.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-orange-100"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
              {order.name}
            </p>
            <p className="text-xs text-gray-500">
              ₹{order.price.toLocaleString("en-IN")} / unit
              {(order.minQuantity || order.maxQuantity) && (
                <span className="ml-2">
                  · Qty: {order.minQuantity}–{order.maxQuantity}
                </span>
              )}
            </p>
          </div>
          {order.category && (
            <span className="text-xs bg-white border border-orange-200 text-orange-600 px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0">
              {order.category}
            </span>
          )}
        </div>

        {/* ══════════════════════════════════════════
            SUCCESS STATE
        ══════════════════════════════════════════ */}
        {step === "success" && (
          <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Order Confirmed! 🎉
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
              Payment successful. We'll contact you at{" "}
              <span className="font-medium text-gray-700">{form.phone}</span>{" "}
              within 2 hours to finalise your event.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition"
            >
              Close
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════
            PAYING STATE (Razorpay is open as overlay)
        ══════════════════════════════════════════ */}
        {step === "paying" && (
          <div className="px-4 sm:px-6 py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CreditCard className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-sm font-semibold text-gray-800">
              Complete your payment in the Razorpay window
            </p>
            <p className="text-xs text-gray-400">
              Do not close this page. Your order will be confirmed once payment
              is successful.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-2">
              <Lock className="w-3 h-3" />
              Secured by Razorpay
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            STEP 1: PERSONAL & EVENT INFO
        ══════════════════════════════════════════ */}
        {step === "step1" && (
          <form onSubmit={(e) => { e.preventDefault(); handleStep1Next(); }} className="px-4 sm:px-6 py-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
                {error}
              </div>
            )}

            {/* STEP INDICATOR */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                2
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Optional"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.eventType}
                    onChange={(e) => set("eventType", e.target.value)}
                    className={inp + " appearance-none pr-8"}
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.eventDate}
                  onChange={(e) => set("eventDate", e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm text-white transition flex items-center justify-center gap-2 ${
                  isStep1Valid
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg"
                    : "bg-orange-300 cursor-not-allowed"
                }`}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════
            STEP 2: QUANTITY & REQUIREMENTS
        ══════════════════════════════════════════ */}
        {step === "step2" && (
          <form onSubmit={handleStep2Submit} className="px-4 sm:px-6 py-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
                {error}
              </div>
            )}

            {/* STEP INDICATOR */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
            </div>

            {/* SUMMARY OF STEP 1 DATA */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <p className="text-xs font-semibold text-blue-900">Order Summary</p>
              <div className="text-xs text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{form.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Event:</span>
                  <span className="font-medium">{form.eventType} on {form.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-medium">{form.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                  {(order.minQuantity || order.maxQuantity) && (
                    <span className="text-gray-400 font-normal ml-1">
                      (Min: {order.minQuantity ?? 1}
                      {order.maxQuantity ? `, Max: ${order.maxQuantity}` : ""})
                    </span>
                  )}
                </label>
                <input
                  required
                  type="number"
                  min={order.minQuantity ?? 1}
                  max={order.maxQuantity ?? undefined}
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder={`Min. ${order.minQuantity ?? 1}`}
                  className={inp}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Additional Requirements
              </label>
              <textarea
                rows={3}
                value={form.requirements}
                onChange={(e) => set("requirements", e.target.value)}
                placeholder="Menu preferences, dietary needs, delivery instructions..."
                className={inp + " resize-none"}
              />
            </div>

            {estimatedTotal !== null && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm text-orange-700 font-medium">
                  💡 Estimated total:{" "}
                  <span className="text-orange-600 font-bold text-sm sm:text-base">
                    ₹{estimatedTotal.toLocaleString("en-IN")}
                  </span>
                  <span className="text-orange-500 text-xs font-normal ml-1">
                    ({form.quantity} × ₹
                    {order.price.toLocaleString("en-IN")})
                  </span>
                </p>
              </div>
            )}

            {/* Payment notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
              <span>
                Your request will be confirmed only after successful payment via
                Razorpay. No charges until you approve.
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleStep2Back}
                className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm text-gray-700 transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm text-white transition flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Proceed to Pay
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Bulk Order Card ────────────────────────── */
function BulkOrderCard({
  order,
  onGetQuote,
}: {
  order: BulkOrder;
  onGetQuote: (o: BulkOrder) => void;
}) {
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 overflow-hidden group transform hover:scale-105">
      <ImageSlider images={order.imageUrl} name={order.name} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2">
            {order.name}
          </h3>
          {order.category && (
            <span className="shrink-0 text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full font-semibold capitalize">
              {order.category}
            </span>
          )}
        </div>
        {order.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
            {order.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-500 mb-4">
          {(order.minQuantity || order.maxQuantity) && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {order.minQuantity}–{order.maxQuantity} pcs
            </span>
          )}
          {order.preparationTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {order.preparationTime} mins
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg sm:text-xl font-bold text-orange-600">
              ₹{order.price.toLocaleString("en-IN")}
            </span>
            <p className="text-xs text-gray-400">/meal</p>
          </div>
          <button
            onClick={() => onGetQuote(order)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition active:scale-95"
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 sm:h-52 bg-gray-100" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between mt-4">
          <div className="h-6 bg-gray-100 rounded w-20" />
          <div className="h-8 bg-gray-100 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

const PACKAGES = [
  {
    id: "silver",
    name: "Silver",
    price: 110,
    minMeals: 20,
    popular: false,
    features: [
      "Standard packaging",
      "Basic customization",
      "24hr advance order",
    ],
    icon: Target,
  },
  {
    id: "gold",
    name: "Gold",
    price: 95,
    minMeals: 50,
    popular: true,
    features: [
      "Premium packaging",
      "Menu customization",
      "Dedicated support",
      "Same day delivery",
    ],
    icon: Award,
  },
  {
    id: "premium",
    name: "Premium",
    price: 85,
    minMeals: 100,
    popular: false,
    features: [
      "Luxury packaging",
      "Full menu customization",
      "Priority support",
      "Live tracking",
      "Setup assistance",
    ],
    icon: Sparkles,
  },
];

export default function BulkOrdersPage() {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [quoteOrder, setQuoteOrder] = useState<BulkOrder | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingOrders(true);
      try {
        const res = await api.get("/bulk/public");
        if (res.data.success) setBulkOrders(res.data.data || []);
      } catch {
        setOrdersError("Failed to load bulk orders.");
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, []);

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-gray-50 py-12 sm:py-16 px-4 text-center border-b border-orange-100">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full border border-orange-200">
            <span className="text-xs sm:text-sm font-semibold text-orange-600 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Bulk Orders & Catering
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Bulk Orders for Events & Parties
          </h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
            Perfect for corporate events, weddings, birthday parties, college
            fests, and large gatherings. Fresh meals, competitive pricing, and
            reliable delivery.
          </p>
          <button
            onClick={() =>
              document.getElementById("bulk-packs")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white font-semibold text-xs sm:text-base rounded-lg sm:rounded-xl transition transform hover:scale-105 active:scale-95"
          >
            <TrendingUp className="w-4 h-4" />
            Browse Packs
          </button>
        </div>
      </section>
  {/* BULK PACKS */}
      <section
        id="bulk-packs"
        className="py-12 sm:py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Available Bulk Packs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Choose your favorite meal and get a custom quote for your event
            </p>
          </div>
          {ordersError ? (
            <div className="text-center py-12 text-red-500 text-xs sm:text-sm">
              {ordersError}
            </div>
          ) : loadingOrders ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : bulkOrders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-gray-500 font-medium text-sm sm:text-base">
                No bulk packs available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {bulkOrders.map((order) => (
                <BulkOrderCard
                  key={order._id}
                  order={order}
                  onGetQuote={setQuoteOrder}
                />
              ))}
            </div>
          )}
        </div>
      </section>

     
      {/* FEATURES */}
      <section className="bg-white py-10 sm:py-12 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Users,
              title: "Any Quantity",
              desc: "From 10 to 50+ guests",
            },
            {
              icon: Clock,
              title: "On-Time Delivery",
              desc: "Guaranteed timely service",
            },
            {
              icon: Shield,
              title: "Quality Assured",
              desc: "Fresh & hygienic meals",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-orange-600">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm text-center">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    

      {/* TRUST STRIP */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-10 sm:py-12 px-4 border-t border-orange-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: "500+", label: "Events Catered", icon: "🎉" },
            { value: "50,000+", label: "Meals Delivered", icon: "🍜" },
            { value: "4.9★", label: "Average Rating", icon: "⭐" },
            { value: "2 hrs", label: "Response Time", icon: "⚡" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl mb-2">{s.icon}</div>
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {s.value}
              </div>
              <div className="text-gray-500 text-xs sm:text-sm mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ready to Plan Your Event?
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-8">
            Get a custom quote within 2 hours. No hidden charges, no surprises.
          </p>
          <button
            onClick={() =>
              document.getElementById("bulk-packs")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white font-semibold text-xs sm:text-base rounded-lg sm:rounded-xl transition transform hover:scale-105 active:scale-95"
          >
            <Target className="w-4 h-4" />
            Get Your Quote Now
          </button>
        </div>
      </section>

      {/* QUOTE DIALOG */}
      {quoteOrder && (
        <QuoteDialog
          order={quoteOrder}
          onClose={() => setQuoteOrder(null)}
        />
      )}
    </main>
  );
}