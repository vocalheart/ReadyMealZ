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
    dispatch(fetchCart() as any).then((result: any) => {
      console.log("✅ Cart fetched, result:", result);
    }).catch((err: any) => {
      console.error("❌ Cart fetch error:", err);
    });
  }, [dispatch]);

  // Redirect if no items
  useEffect(() => {
    if (!cartLoading && cart && cart.items.length === 0 && !orderSuccess) {
      console.log("❌ No items in cart, redirecting...");
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
    setValidationErrors((prev) =>
      prev.filter((err) => err.field !== name)
    );
  };

  const validateForm = (): boolean => {
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

  const handleCreateOrder = async () => {
    setError(null);
    setValidationErrors([]);

    // Debug: Check cart state
    console.log("🛒 Current cart state:", { items, total, itemCount });
    console.log("🛒 Cart from Redux:", cart);

    if (!validateForm()) {
      return;
    }

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

      console.log("📤 Creating order with data:", JSON.stringify(orderData, null, 2));

      const response = await api.post("/orders/create", orderData, {
        withCredentials: true,
      });

      console.log("✅ Order created:", response.data);

      if (response.data.success) {
        setOrderSuccess(true);
        setCreatedOrderId(response.data.data.order._id);

        setTimeout(() => {
          router.push(`/orders/${response.data.data.order._id}`);
        }, 2000);
      } else {
        setError(response.data.message || "Failed to create order");
      }
    } catch (err: any) {
      console.error("❌ Full error object:", err);
      console.error("❌ Error response:", err.response?.data);
      
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to create order";
      setError(errorMsg);

      // Handle validation errors from backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-bold text-gray-900 break-all">
              {createdOrderId}
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to your order details...
          </p>
          <Link
            href="/orders"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your order in a few steps</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Order Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* No Items Error */}
        {items.length === 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">Cart is empty</p>
              <p className="text-sm text-orange-700">
                Add items to your cart before checkout
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryAddress.name}
                    onChange={handleAddressChange}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      validationErrors.find((e) => e.field === "name")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                  />
                  {validationErrors.find((e) => e.field === "name") && (
                    <p className="text-xs text-red-600 mt-1">
                      {validationErrors.find((e) => e.field === "name")?.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="10-12 digit phone number"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      validationErrors.find((e) => e.field === "phone")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                  />
                  {validationErrors.find((e) => e.field === "phone") && (
                    <p className="text-xs text-red-600 mt-1">
                      {validationErrors.find((e) => e.field === "phone")?.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={deliveryAddress.address}
                    onChange={handleAddressChange}
                    placeholder="House number, street name, area"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      validationErrors.find((e) => e.field === "address")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                  />
                  {validationErrors.find((e) => e.field === "address") && (
                    <p className="text-xs text-red-600 mt-1">
                      {validationErrors.find((e) => e.field === "address")?.message}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city name"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      validationErrors.find((e) => e.field === "city")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                  />
                  {validationErrors.find((e) => e.field === "city") && (
                    <p className="text-xs text-red-600 mt-1">
                      {validationErrors.find((e) => e.field === "city")?.message}
                    </p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={deliveryAddress.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      validationErrors.find((e) => e.field === "pincode")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                  />
                  {validationErrors.find((e) => e.field === "pincode") && (
                    <p className="text-xs text-red-600 mt-1">
                      {validationErrors.find((e) => e.field === "pincode")?.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
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
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    description: "Pay when your order arrives",
                  },
                  {
                    id: "online",
                    label: "Credit/Debit Card",
                    description: "Secure online payment",
                  },
                  {
                    id: "upi",
                    label: "UPI",
                    description: "Pay via Google Pay, PhonePe, etc.",
                  },
                  {
                    id: "wallet",
                    label: "Digital Wallet",
                    description: "Use your wallet balance",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                      paymentMethod === method.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
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
                      className="w-4 h-4"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requests Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Special Requests (Optional)
              </h2>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special instructions for your order? (e.g., No onions, Extra spicy, etc.)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition resize-none"
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 max-h-48 overflow-y-auto">
                {items && items.length > 0 ? (
                  items.map((item: any) => (
                    <div key={item.meal._id} className="flex justify-between text-sm">
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
                    <span className="text-sm">No items in cart</span>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-medium text-gray-900">₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{taxAmount}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 text-lg">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-orange-600">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCreateOrder}
                disabled={orderCreating || items.length === 0}
                className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                  orderCreating || items.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {orderCreating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Your order is secured with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}