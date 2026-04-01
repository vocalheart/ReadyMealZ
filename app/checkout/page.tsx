"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { fetchCart } from "../redux/slices/Cartslice";
import {
  MapPin,
  Loader,
  Check,
  AlertCircle,
  ArrowLeft,
  Lock,
  ShoppingCart,
  Phone,
  MapPinIcon,
  CreditCard,
  Smartphone,
  Wallet,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import api from "../lib/axios";

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderError {
  field?: string;
  message: string;
}

/**
 * Enhanced Checkout Page
 * - Full responsive design with mobile optimization (10px minimum text)
 * - Improved UI/UX with modern design patterns
 * - Better form validation and error handling
 * - Smooth animations and transitions
 */
export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux selectors
  const { cart, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );

  const [orderCreating, setOrderCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<OrderError[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"address" | "payment" | "review">(
    "address"
  );

  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "online" | "upi" | "wallet"
  >("cod");
  const [specialRequests, setSpecialRequests] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "Madhya Pradesh",
    pincode: "",
  });

  // Load cart on mount
  useEffect(() => {
    console.log("📦 Fetching cart...");
    dispatch(fetchCart() as any)
      .then((result: any) => {
        console.log(" Cart fetched, result:", result);
      })
      .catch((err: any) => {
        console.error(" Cart fetch error:", err);
      });
  }, [dispatch]);

  // Redirect if no items
  useEffect(() => {
    if (!cartLoading && cart && cart.items.length === 0 && !orderSuccess) {
      console.log(" No items in cart, redirecting...");
      router.push("/cart");
    }
  }, [cartLoading, cart, router, orderSuccess]);

  const items = cart?.items || [];
  const total = cart?.cartTotal || 0;
  const itemCount = cart?.totalItems || 0;

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const validateAddressForm = (): boolean => {
    const errors: OrderError[] = [];

    if (!deliveryAddress.name.trim()) {
      errors.push({ field: "name", message: "Recipient name is required" });
    } else if (deliveryAddress.name.trim().length < 2) {
      errors.push({
        field: "name",
        message: "Name must be at least 2 characters",
      });
    }

    if (!deliveryAddress.phone.trim()) {
      errors.push({ field: "phone", message: "Phone number is required" });
    } else if (!/^[0-9]{10,12}$/.test(deliveryAddress.phone)) {
      errors.push({
        field: "phone",
        message: "Valid phone number (10-12 digits) is required",
      });
    }

    if (!deliveryAddress.address.trim()) {
      errors.push({ field: "address", message: "Address is required" });
    } else if (deliveryAddress.address.trim().length < 5) {
      errors.push({
        field: "address",
        message: "Address must be at least 5 characters",
      });
    }

    if (!deliveryAddress.city.trim()) {
      errors.push({ field: "city", message: "City is required" });
    }

    if (!deliveryAddress.pincode.trim()) {
      errors.push({ field: "pincode", message: "Pincode is required" });
    } else if (!/^[0-9]{6}$/.test(deliveryAddress.pincode)) {
      errors.push({
        field: "pincode",
        message: "Pincode must be exactly 6 digits",
      });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === "address") {
      if (validateAddressForm()) {
        setCurrentStep("payment");
      }
    } else if (currentStep === "payment") {
      setCurrentStep("review");
    }
  };

  const handleCreateOrder = async () => {
    setError(null);

    console.log("🛒 Current cart state:", { items, total, itemCount });
    console.log("🛒 Cart from Redux:", cart);

    setOrderCreating(true);

    try {
      const orderData = {
        deliveryAddress: {
          name: deliveryAddress.name.trim(),
          phone: deliveryAddress.phone.trim(),
          address: deliveryAddress.address.trim(),
          city: deliveryAddress.city.trim(),
          state: deliveryAddress.state.trim(),
          pincode: deliveryAddress.pincode.trim(),
        },
        paymentMethod,
        specialRequests: specialRequests.trim(),
        useCart: true,
      };

      console.log(
        "📤 Creating order with data:",
        JSON.stringify(orderData, null, 2)
      );

      const response = await api.post("/orders/create", orderData, {
        withCredentials: true,
      });

      console.log(" Order created:", response.data);

      if (response.data.success) {
        setOrderSuccess(true);
        setCreatedOrderId(response.data.data.order._id);

        setTimeout(() => {
          router.push(`/orders/${response.data.data.order._id}`);
        }, 2500);
      } else {
        setError(response.data.message || "Failed to create order");
      }
    } catch (err: any) {
      console.error("❌ Full error object:", err);
      console.error("❌ Error response:", err.response?.data);

      const errorMsg =
        err.response?.data?.message || err.message || "Failed to create order";
      setError(errorMsg);

      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        console.log("❌ Validation errors:", err.response.data.errors);
        setValidationErrors(err.response.data.errors);
      }
    } finally {
      setOrderCreating(false);
    }
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium text-xs sm:text-base">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Order ID</p>
            <p className="font-mono font-bold text-gray-900 text-xs sm:text-sm break-all">
              {createdOrderId}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex items-center justify-center gap-2">
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            Redirecting to order details...
          </p>

          <Link
            href="/orders"
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-base rounded-lg hover:shadow-lg transition"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const taxAmount = parseFloat((total * 0.05).toFixed(2));
  const deliveryCharge = 40;
  const finalTotal = total + taxAmount + deliveryCharge;
  const savings = Math.floor(Math.random() * 100) + 20;

  const paymentMethods = [
    {
      id: "cod",
      label: "Cash on Delivery",
      description: "Pay when order arrives",
      icon: Wallet,
    },
    {
      id: "online",
      label: "Credit/Debit Card",
      description: "Secure online payment",
      icon: CreditCard,
    },
    {
      id: "upi",
      label: "UPI Payment",
      description: "Google Pay, PhonePe, etc.",
      icon: Smartphone,
    },
    {
      id: "wallet",
      label: "Digital Wallet",
      description: "Use wallet balance",
      icon: Wallet,
    },
  ];

  const steps = ["address", "payment", "review"];
  const stepNames = {
    address: "Delivery",
    payment: "Payment",
    review: "Review",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition"
          >
            <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
            Back to Cart
          </Link>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                Checkout
              </h1>
              <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">
                Complete your order securely
              </p>
            </div>
          </div>

          {/* Progress Steps - Mobile */}
          <div className="md:hidden flex gap-2 overflow-x-auto">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition ${
                    steps.indexOf(currentStep) >= idx
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-6 h-0.5 ${
                      steps.indexOf(currentStep) > idx
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress Steps - Desktop */}
          <div className="hidden md:flex justify-center gap-8 my-6">
            {steps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition ${
                    steps.indexOf(currentStep) >= idx
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {steps.indexOf(currentStep) > idx ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 mt-2">
                  {stepNames[step as keyof typeof stepNames]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 animate-pulse">
            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-xs sm:text-sm">
                Order Error
              </p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Delivery Address Section */}
            {(currentStep === "address" || currentStep === "review") && (
              <div
                className={`bg-white rounded-lg sm:rounded-2xl border transition-all ${
                  currentStep === "address"
                    ? "border-orange-300 shadow-md"
                    : "border-gray-200"
                } p-4 sm:p-6 md:p-8`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold text-gray-900">
                      Delivery Address
                    </h2>
                  </div>
                  {currentStep !== "address" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                {currentStep === "address" ? (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={deliveryAddress.name}
                        onChange={handleAddressChange}
                        placeholder="Full name"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border transition ${
                          validationErrors.find((e) => e.field === "name")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-orange-500"
                        } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                      />
                      {validationErrors.find((e) => e.field === "name") && (
                        <p className="text-xs text-red-600 mt-1">
                          {
                            validationErrors.find((e) => e.field === "name")
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={deliveryAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="10-12 digits"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border transition ${
                          validationErrors.find((e) => e.field === "phone")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-orange-500"
                        } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                      />
                      {validationErrors.find((e) => e.field === "phone") && (
                        <p className="text-xs text-red-600 mt-1">
                          {
                            validationErrors.find((e) => e.field === "phone")
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Full Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={deliveryAddress.address}
                        onChange={handleAddressChange}
                        placeholder="House, street, area"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border transition ${
                          validationErrors.find((e) => e.field === "address")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-orange-500"
                        } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                      />
                      {validationErrors.find((e) => e.field === "address") && (
                        <p className="text-xs text-red-600 mt-1">
                          {
                            validationErrors.find((e) => e.field === "address")
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleAddressChange}
                        placeholder="City name"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border transition ${
                          validationErrors.find((e) => e.field === "city")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-orange-500"
                        } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                      />
                      {validationErrors.find((e) => e.field === "city") && (
                        <p className="text-xs text-red-600 mt-1">
                          {
                            validationErrors.find((e) => e.field === "city")
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={deliveryAddress.pincode}
                        onChange={handleAddressChange}
                        placeholder="6 digits"
                        maxLength={6}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border transition ${
                          validationErrors.find((e) => e.field === "pincode")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-orange-500"
                        } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                      />
                      {validationErrors.find((e) => e.field === "pincode") && (
                        <p className="text-xs text-red-600 mt-1">
                          {
                            validationErrors.find((e) => e.field === "pincode")
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        State
                      </label>
                      <select
                        name="state"
                        value={deliveryAddress.state}
                        onChange={handleAddressChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                      >
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {deliveryAddress.name}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      {deliveryAddress.address}
                    </p>
                    <p className="text-gray-600">
                      {deliveryAddress.city}, {deliveryAddress.state}{" "}
                      {deliveryAddress.pincode}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 pt-2 border-t border-gray-200 mt-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      <p>{deliveryAddress.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Method Section */}
            {(currentStep === "payment" || currentStep === "review") && (
              <div
                className={`bg-white rounded-lg sm:rounded-2xl border transition-all ${
                  currentStep === "payment"
                    ? "border-orange-300 shadow-md"
                    : "border-gray-200"
                } p-4 sm:p-6 md:p-8`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold text-gray-900">
                      Payment Method
                    </h2>
                  </div>
                  {currentStep !== "payment" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                {currentStep === "payment" ? (
                  <div className="space-y-2 sm:space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                            paymentMethod === method.id
                              ? "border-orange-500 bg-orange-50 shadow-md"
                              : "border-gray-200 hover:border-orange-300 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) =>
                              setPaymentMethod(
                                e.target.value as
                                  | "cod"
                                  | "online"
                                  | "upi"
                                  | "wallet"
                              )
                            }
                            className="w-4 h-4 text-orange-600 cursor-pointer"
                          />
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 ml-3 flex-shrink-0" />
                          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                              {method.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {method.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {paymentMethods.find((m) => m.id === paymentMethod)
                          ?.label}
                      </span>
                      <br />
                      <span className="text-gray-600">
                        {paymentMethods.find((m) => m.id === paymentMethod)
                          ?.description}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Special Requests Section */}
            {(currentStep === "payment" || currentStep === "review") && (
              <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
                <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Special Requests (Optional)
                </h2>
                {currentStep === "payment" ? (
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special instructions? (e.g., No onions, Extra spicy)"
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition resize-none"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-700">
                      {specialRequests || "No special requests"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step Navigation - Mobile */}
            <div className="md:hidden flex gap-2">
              {currentStep !== "address" && (
                <button
                  onClick={() => {
                    const stepIdx = steps.indexOf(currentStep);
                    setCurrentStep(steps[stepIdx - 1] as any);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              {currentStep !== "review" && (
                <button
                  onClick={handleNextStep}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white font-semibold text-xs sm:text-sm rounded-lg hover:bg-orange-600 transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 sticky top-4 sm:top-24">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Order Summary
              </h2>

              {/* Savings Badge */}
              {savings > 0 && (
                <div className="mb-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-semibold">
                    Save ₹{savings}!
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 max-h-40 overflow-y-auto">
                {items && items.length > 0 ? (
                  items.map((item: any) => (
                    <div
                      key={item.meal._id}
                      className="flex justify-between text-xs sm:text-sm"
                    >
                      <span className="text-gray-600">
                        {item.meal.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-xs">No items</span>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">
                    ₹{deliveryCharge}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{taxAmount}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-4 sm:mb-6 text-sm sm:text-base">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-orange-600">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              {/* CTA Button - Desktop */}
              <div className="hidden md:block space-y-3">
                {currentStep === "review" && (
                  <button
                    onClick={handleCreateOrder}
                    disabled={orderCreating || items.length === 0}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 text-sm ${
                      orderCreating || items.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg"
                    }`}
                  >
                    {orderCreating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </button>
                )}
                {currentStep !== "review" && (
                  <button
                    onClick={handleNextStep}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transition text-sm"
                  >
                    Continue
                  </button>
                )}

                {/* Security Badge */}
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg flex items-center gap-2 border border-blue-200">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    Secured with SSL encryption
                  </p>
                </div>
              </div>

              {/* CTA Button - Mobile */}
              <div className="md:hidden">
                {currentStep === "review" && (
                  <button
                    onClick={handleCreateOrder}
                    disabled={orderCreating || items.length === 0}
                    className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 text-xs sm:text-sm ${
                      orderCreating || items.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg"
                    }`}
                  >
                    {orderCreating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                        Place Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}