"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { fetchCart } from "../redux/slices/Cartslice";
import {
  MapPin, Loader, Check, AlertCircle, ArrowLeft, Lock,
  ShoppingCart, Phone, CreditCard, Wallet, TrendingDown,
  CheckCircle2, Plus, Home, Zap, Package, Percent,
} from "lucide-react";
import api from "../lib/axios";

interface SavedAddress {
  _id: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Pricing {
  subtotal: number;
  distanceKm: number;
  minimumOrderAmount: number;
  freeDeliveryAbove: number;
  deliveryCharge: number;
  surgeCharge: number;
  packagingCharge: number;
  gstPercentage: number;
  gstAmount: number;
  finalAmount: number;
}

interface OrderError {
  field?: string;
  message: string;
}

export default function CheckoutPage() {
  const router   = useRouter();
  const dispatch = useDispatch();

  const { cart, loading: cartLoading } = useSelector((state: RootState) => state.cart);

  const [orderCreating,     setOrderCreating]     = useState(false);
  const [error,             setError]             = useState<string | null>(null);
  const [validationErrors,  setValidationErrors]  = useState<OrderError[]>([]);
  const [orderSuccess,      setOrderSuccess]       = useState(false);
  const [createdOrderId,    setCreatedOrderId]     = useState<string | null>(null);
  const [currentStep,       setCurrentStep]        = useState<"address" | "payment" | "review">("address");
  const [paymentMethod,     setPaymentMethod]      = useState<"cod" | "online" | "upi" | "wallet">("cod");
  const [specialRequests,   setSpecialRequests]    = useState("");

  // Address
  const [savedAddresses,    setSavedAddresses]     = useState<SavedAddress[]>([]);
  const [addressLoading,    setAddressLoading]     = useState(true);
  const [selectedAddressId, setSelectedAddressId]  = useState<string | null>(null);

  // Pricing from API
  const [pricing,        setPricing]        = useState<Pricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  /* ── Load cart ── */
  useEffect(() => { dispatch(fetchCart() as any); }, [dispatch]);

  /* ── Fetch saved addresses ── */
  useEffect(() => {
    const fetchAddresses = async () => {
      setAddressLoading(true);
      try {
        const res = await api.get("/user/address", { withCredentials: true });
        const addresses: SavedAddress[] = res.data?.data || [];
        setSavedAddresses(addresses);
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  /* ── Auto-calculate pricing when address changes ── */
  useEffect(() => {
    if (selectedAddressId) calculatePricing(selectedAddressId);
  }, [selectedAddressId]);

  /* ── Redirect if cart empty ── */
  useEffect(() => {
    if (!cartLoading && cart && cart.items.length === 0 && !orderSuccess)
      router.push("/cart");
  }, [cartLoading, cart, router, orderSuccess]);

  const items           = cart?.items || [];
  const selectedAddress = savedAddresses.find(a => a._id === selectedAddressId);

  /* ── Calculate pricing from backend ── */
  const calculatePricing = async (addressId: string) => {
    setPricingLoading(true);
    setError(null);
    try {
      const res = await api.post(
        "/user/calculate-delivery",
        { addressId },
        { withCredentials: true }
      );
      setPricing(res.data.pricing);
    } catch (err: any) {
      setPricing(null);
      setError(err.response?.data?.message || "Failed to calculate pricing");
    } finally {
      setPricingLoading(false);
    }
  };

  /* ── Step validation ── */
  const validateAddressStep = (): boolean => {
    if (!selectedAddressId) {
      setValidationErrors([{ message: "Please select a delivery address." }]);
      return false;
    }
    if (!pricing && !pricingLoading) {
      setValidationErrors([{ message: "Unable to calculate delivery pricing. Please try again." }]);
      return false;
    }
    setValidationErrors([]);
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === "address") {
      if (validateAddressStep()) setCurrentStep("payment");
    } else if (currentStep === "payment") {
      setCurrentStep("review");
    }
  };

  /* ── Place order ── */
  const handleCreateOrder = async () => {
    if (!selectedAddressId) { setError("Please select a delivery address."); return; }
    setError(null);
    setOrderCreating(true);

    try {
      const response = await api.post(
        "/orders/create",
        {
          deliveryAddress: selectedAddressId,
          paymentMethod,
          specialRequests: specialRequests.trim(),
          useCart: true,
        },
        { withCredentials: true }
      );

      /* ── destructure: razorpayOrder + orderData (not `order`) ── */
      const { razorpayOrder, orderData } = response.data.data;

      /* ─────────────── COD ─────────────── */
      if (paymentMethod === "cod") {
        await dispatch(fetchCart() as any);
        setOrderSuccess(true);
        setCreatedOrderId(orderData._id);
        setTimeout(() => router.push(`/orders/${orderData._id}`), 2000);
        return;
      }

      /* ─────────────── ONLINE / UPI ─────────────── */
      if (paymentMethod === "online") {
        if (!(window as any).Razorpay) {
          setError("Razorpay not loaded. Please refresh and try again.");
          setOrderCreating(false);
          return;
        }

        const rzp = new (window as any).Razorpay({
          key:         "rzp_test_SYa9s5fnNprq4h",
          amount:      razorpayOrder.amount,
          currency:    razorpayOrder.currency,
          order_id:    razorpayOrder.id,
          name:        "Food App",
          description: "Order Payment",

          /* ── Fixed handler — works on mobile UPI / GPay / PhonePe ── */
          handler: async (paymentResponse: any) => {
            try {
              const verifyRes = await api.post(
                "/orders/verify-payment",
                {
                  razorpay_order_id:   paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature:  paymentResponse.razorpay_signature,
                  /* send order context so backend can reconcile */
                  orderData: {
                    items:           orderData.items,
                    subtotal:        orderData.subtotal,
                    pricing,
                    deliveryAddress: selectedAddressId,
                    specialRequests,
                  },
                },
                { withCredentials: true }
              );

              const createdOrder = verifyRes.data?.data?.order;

              await dispatch(fetchCart() as any);
              setOrderSuccess(true);
              setCreatedOrderId(createdOrder._id);
              setTimeout(() => router.push(`/orders/${createdOrder._id}`), 1500);
            } catch (err: any) {
              console.error("Payment verification failed:", err);
              setError(
                err?.response?.data?.message ||
                "Payment successful but order verification failed. Contact support."
              );
            }
          },

          prefill: {
            name:    selectedAddress?.recipientName || "",
            contact: selectedAddress?.phoneNumber   || "",
          },
          theme: { color: "#f97316" },

          /* ── Critical for mobile UPI redirect ── */
          redirect: true,
        });

        rzp.on("payment.failed", (failResponse: any) => {
          console.error("Razorpay payment failed:", failResponse);
          setError("Payment failed. Please try again.");
          setOrderCreating(false);
        });

        rzp.open();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setOrderCreating(false);
    }
  };

  /* ── Loading ── */
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium text-xs sm:text-base">Loading your cart...</p>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">Your order has been confirmed and will be delivered soon.</p>
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mb-6 border border-orange-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Order ID</p>
            <p className="font-mono font-bold text-gray-900 text-xs sm:text-sm break-all">{createdOrderId}</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            Redirecting to order details...
          </p>
          <Link href="/orders" className="inline-block px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-base rounded-lg hover:shadow-lg transition">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const steps     = ["address", "payment", "review"];
  const stepNames = { address: "Delivery", payment: "Payment", review: "Review" };

  const paymentMethods = [
    { id: "cod",    label: "Cash on Delivery",     description: "Pay when order arrives",  icon: Wallet     },
    { id: "online", label: "UPI / Credit / Debit", description: "Secure online payment",   icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition">
            <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" /> Back to Cart
          </Link>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">Complete your order securely</p>

          {/* Progress — Mobile */}
          <div className="md:hidden flex gap-2 overflow-x-auto mt-4">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${steps.indexOf(currentStep) >= idx ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-6 h-0.5 ${steps.indexOf(currentStep) > idx ? "bg-orange-500" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Progress — Desktop */}
          <div className="hidden md:flex justify-center gap-8 my-6">
            {steps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition ${steps.indexOf(currentStep) >= idx ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {steps.indexOf(currentStep) > idx ? <Check className="w-6 h-6" /> : idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 mt-2">{stepNames[step as keyof typeof stepNames]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Error Alert ── */}
        {(error || validationErrors.length > 0) && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="font-semibold text-red-900 text-xs sm:text-sm">{error || validationErrors[0]?.message}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ── Main Form ── */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* STEP 1 — Address */}
            {(currentStep === "address" || currentStep === "review") && (
              <div className={`bg-white rounded-xl border transition-all ${currentStep === "address" ? "border-orange-300 shadow-md" : "border-gray-200"} p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold text-gray-900">Delivery Address</h2>
                  </div>
                  {currentStep !== "address" && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                </div>

                {currentStep === "address" ? (
                  <>
                    {addressLoading ? (
                      <div className="flex items-center justify-center py-8 gap-3 text-gray-500">
                        <Loader className="w-5 h-5 animate-spin text-orange-500" />
                        <span className="text-sm">Loading addresses...</span>
                      </div>
                    ) : savedAddresses.length === 0 ? (
                      <div className="text-center py-8">
                        <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-4">No saved addresses found.</p>
                        <Link href="/address" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition">
                          <Plus className="w-4 h-4" /> Add Address
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {savedAddresses.map(addr => (
                          <label key={addr._id}
                            className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr._id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300 bg-white"}`}>
                            <input type="radio" name="selectedAddress" value={addr._id}
                              checked={selectedAddressId === addr._id}
                              onChange={() => {
                                setSelectedAddressId(addr._id);
                                setValidationErrors([]);
                                setError(null);
                              }}
                              className="mt-1 w-4 h-4 text-orange-600 cursor-pointer flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm">{addr.recipientName}</p>
                                {addr.isDefault && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">{addr.fullAddress}</p>
                              <p className="text-xs text-gray-600">{addr.city}, {addr.state} – {addr.pincode}</p>
                              <div className="flex items-center gap-1 mt-1 text-gray-500">
                                <Phone className="w-3 h-3" />
                                <span className="text-xs">{addr.phoneNumber}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                        <Link href="/address"
                          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-orange-400 hover:text-orange-600 transition text-xs sm:text-sm font-medium">
                          <Plus className="w-4 h-4" /> Add New Address
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  selectedAddress && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-1 text-xs sm:text-sm">
                      <p className="font-semibold text-gray-900">{selectedAddress.recipientName}</p>
                      <p className="text-gray-600">{selectedAddress.fullAddress}</p>
                      <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}</p>
                      <div className="flex items-center gap-2 text-gray-600 pt-2 border-t border-gray-200 mt-1">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <p>{selectedAddress.phoneNumber}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* STEP 2 — Payment */}
            {(currentStep === "payment" || currentStep === "review") && (
              <div className={`bg-white rounded-xl border transition-all ${currentStep === "payment" ? "border-orange-300 shadow-md" : "border-gray-200"} p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold text-gray-900">Payment Method</h2>
                  </div>
                  {currentStep !== "payment" && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                </div>

                {currentStep === "payment" ? (
                  <div className="space-y-2 sm:space-y-3">
                    {paymentMethods.map(method => {
                      const Icon = method.icon;
                      return (
                        <label key={method.id}
                          className={`flex items-center p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === method.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300 bg-white"}`}>
                          <input type="radio" name="paymentMethod" value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={e => setPaymentMethod(e.target.value as any)}
                            className="w-4 h-4 text-orange-600" />
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 ml-3 flex-shrink-0" />
                          <div className="ml-2 sm:ml-3 flex-1">
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">{method.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
                    <p className="font-semibold text-gray-900">{paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                    <p className="text-gray-600 mt-0.5">{paymentMethods.find(m => m.id === paymentMethod)?.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Special Requests */}
            {(currentStep === "payment" || currentStep === "review") && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Special Requests (Optional)</h2>
                {currentStep === "payment" ? (
                  <textarea
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    placeholder="Any special instructions? (e.g., No onions, Extra spicy)"
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition resize-none"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-700">{specialRequests || "No special requests"}</p>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Step Nav */}
            <div className="md:hidden flex gap-2">
              {currentStep !== "address" && (
                <button
                  onClick={() => { const i = steps.indexOf(currentStep); setCurrentStep(steps[i - 1] as any); }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              {currentStep !== "review" && (
                <button onClick={handleNextStep}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white font-semibold text-xs rounded-lg hover:bg-orange-600 transition">
                  Next
                </button>
              )}
            </div>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 sticky top-4 sm:top-24">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>

              {/* Free delivery badge */}
              {pricing && pricing.deliveryCharge === 0 && (
                <div className="mb-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-semibold">Free delivery on this order!</p>
                </div>
              )}

              {/* Items list */}
              <div className="space-y-1.5 mb-4 pb-4 border-b border-gray-200 max-h-40 overflow-y-auto">
                {items?.filter((item: any) => item?.meal)?.map((item: any) => (
                  <div key={item?.meal?._id || Math.random()} className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item?.meal?.name || "Meal unavailable"} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 flex-shrink-0">₹{item.totalPrice}</span>
                  </div>
                ))}
                {(!items || items.length === 0) && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-xs">No items</span>
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              {pricingLoading ? (
                <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                  <Loader className="w-4 h-4 animate-spin text-orange-400" />
                  <span className="text-xs">Calculating pricing…</span>
                </div>
              ) : pricing ? (
                <>
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">₹{pricing.subtotal}</span>
                    </div>

                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        Delivery
                        {pricing.distanceKm > 0 && (
                          <span className="text-[10px] text-gray-400">({pricing.distanceKm} km)</span>
                        )}
                      </span>
                      <span className={`font-medium ${pricing.deliveryCharge === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {pricing.deliveryCharge === 0 ? "FREE" : `₹${pricing.deliveryCharge}`}
                      </span>
                    </div>

                    {pricing.surgeCharge > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-orange-400" /> Surge
                        </span>
                        <span className="font-medium text-orange-600">₹{pricing.surgeCharge}</span>
                      </div>
                    )}

                    {pricing.packagingCharge > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Package className="w-3 h-3 text-gray-400" /> Packaging
                        </span>
                        <span className="font-medium text-gray-900">₹{pricing.packagingCharge}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-gray-400" /> GST ({pricing.gstPercentage}%)
                      </span>
                      <span className="font-medium text-gray-900">₹{pricing.gstAmount}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between mb-4 sm:mb-6 text-sm sm:text-base">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-bold text-orange-600">₹{pricing.finalAmount}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{cart?.cartTotal || 0}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Select an address to see full pricing</p>
                </div>
              )}

              {/* Desktop CTA */}
              <div className="hidden md:block space-y-3">
                {currentStep !== "review" ? (
                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === "address" && (savedAddresses.length === 0 || pricingLoading)}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pricingLoading ? "Calculating…" : "Continue"}
                  </button>
                ) : (
                  <button
                    onClick={handleCreateOrder}
                    disabled={orderCreating || items.length === 0 || !pricing}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 text-sm ${
                      orderCreating || items.length === 0 || !pricing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg"
                    }`}
                  >
                    {orderCreating
                      ? <><Loader className="w-4 h-4 animate-spin" />Creating...</>
                      : <><Lock className="w-4 h-4" />Place Order · ₹{pricing?.finalAmount ?? 0}</>
                    }
                  </button>
                )}
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg flex items-center gap-2 border border-blue-200">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700">Secured with SSL encryption</p>
                </div>
              </div>

              {/* Mobile Place Order */}
              {currentStep === "review" && (
                <div className="md:hidden">
                  <button
                    onClick={handleCreateOrder}
                    disabled={orderCreating || items.length === 0 || !pricing}
                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 text-xs ${
                      orderCreating || items.length === 0 || !pricing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg"
                    }`}
                  >
                    {orderCreating
                      ? <><Loader className="w-4 h-4 animate-spin" />Creating...</>
                      : <><Lock className="w-3 h-3" />Place Order · ₹{pricing?.finalAmount ?? 0}</>
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}