"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
  Loader,
  Download,
  MessageSquare,
  CheckCircle,
  X,
} from "lucide-react";
import api from "../../lib/axios";

interface OrderItem {
  _id: string;
  meal: {
    _id: string;
    name: string;
    price: number;
    images?: Array<{ url: string }>;
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  orderTotal: number;
  paymentMethod: "cod" | "online" | "upi" | "wallet";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "placed"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  specialRequests?: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    notes: string;
  }>;
}

const statusConfig = {
  placed: {
    icon: Package,
    label: "Order Placed",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  confirmed: {
    icon: CheckCircle,
    label: "Order Confirmed",
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  preparing: {
    icon: Package,
    label: "Preparing",
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  ready: {
    icon: Package,
    label: "Ready for Pickup",
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  out_for_delivery: {
    icon: Truck,
    label: "Out for Delivery",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  cancelled: {
    icon: AlertCircle,
    label: "Cancelled",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

/**
 * Order Details Page
 * Displays complete order information and status tracking
 * Fully responsive with mobile optimization
 */
export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("📋 Fetching order:", orderId);
        const response = await api.get(`/orders/${orderId}`, {
          withCredentials: true,
        });

        console.log("✅ Order fetched:", response.data);

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch order");
        }
      } catch (err: any) {
        console.error("❌ Error fetching order:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    setCancelLoading(true);
    setCancelError(null);

    try {
      console.log("📝 Cancelling order:", orderId);
      const response = await api.patch(
        `/orders/${orderId}/cancel`,
        { reason: cancelReason.trim() },
        { withCredentials: true }
      );

      console.log("✅ Order cancelled:", response.data);

      if (response.data.success) {
        // Update order state
        setOrder(prev => prev ? { ...prev, orderStatus: 'cancelled' } : null);
        setCancelModal(false);
        setCancelReason("");
        
        // Show success message
        alert("Order cancelled successfully!");
      } else {
        setCancelError(response.data.message || "Failed to cancel order");
      }
    } catch (err: any) {
      console.error("❌ Cancel error:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to cancel order";
      setCancelError(errorMsg);
    } finally {
      setCancelLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-6 sm:p-8 text-center">
            <AlertCircle className="w-10 sm:w-12 h-10 sm:h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <Link
              href="/orders"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white font-semibold text-xs sm:text-sm rounded-lg hover:bg-orange-600 transition"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo =
    statusConfig[order.orderStatus as keyof typeof statusConfig];
  const StatusIcon = statusInfo.icon;
  const canCancel = ["placed", "confirmed"].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <Link
          href="/orders"
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4 sm:mb-6 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
          Back to Orders
        </Link>

        {/* Order Status Header */}
        <div
          className={`rounded-xl sm:rounded-2xl border ${statusInfo.borderColor} ${statusInfo.bgColor} p-3 sm:p-8 mb-4 sm:mb-8`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3 sm:gap-0">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <StatusIcon className={`w-5 sm:w-6 h-5 sm:h-6 text-${statusInfo.color}-600`} />
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                  {statusInfo.label}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Order #{order.orderNumber}
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition font-medium text-xs sm:text-sm text-gray-700 w-full sm:w-auto">
              <Download className="w-3 sm:w-4 h-3 sm:h-4" />
              Invoice
            </button>
          </div>

          {/* Timeline */}
          <div className="mt-4 sm:mt-6 flex items-center gap-1 overflow-x-auto pb-2">
            {["placed", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"].map(
              (status, index) => (
                <React.Fragment key={status}>
                  <div
                    className={`flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      ["placed", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"].indexOf(
                        order.orderStatus
                      ) >= index
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  {index < 5 && (
                    <div
                      className={`flex-shrink-0 h-0.5 sm:h-1 w-8 sm:w-12 ${
                        ["placed", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"].indexOf(
                          order.orderStatus
                        ) > index
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-8">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                Order Items
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    {/* Image */}
                    {item.meal.images?.[0]?.url && (
                      <img
                        src={item.meal.images[0].url}
                        alt={item.meal.name}
                        className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-base line-clamp-1">
                        {item.meal.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-orange-600 mt-1 sm:mt-2">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-xs sm:text-base">
                        ₹{item.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600 flex-shrink-0" />
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="font-semibold text-gray-900 text-xs sm:text-base">
                  {order.deliveryAddress.name}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.deliveryAddress.address}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                  {order.deliveryAddress.pincode}
                </p>
                <div className="flex items-center gap-2 text-gray-600 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                  <Phone className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                  <p className="text-xs sm:text-sm">{order.deliveryAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {order.specialRequests && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600 flex-shrink-0" />
                  <h2 className="text-sm sm:text-lg font-bold text-gray-900">
                    Special Requests
                  </h2>
                </div>
                <p className="text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs sm:text-sm">
                  {order.specialRequests}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-6 sticky top-4 sm:top-24">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">
                    {order.deliveryCharge === 0 ? "Free" : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.tax}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-4 sm:mb-6 text-sm sm:text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600">
                  ₹{order.orderTotal}
                </span>
              </div>

              {/* Payment Status */}
              <div className="mb-3 sm:mb-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                <p className="font-semibold text-gray-900 capitalize text-xs sm:text-sm">
                  {order.paymentStatus}
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-3 sm:mb-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900 capitalize text-xs sm:text-sm">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </p>
              </div>

              {/* Order Date */}
              <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4">
                <button
                  onClick={() => setCancelModal(true)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-red-50 text-red-600 font-medium text-xs sm:text-sm rounded-lg hover:bg-red-100 transition"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Cancel Order
              </h3>
              <button
                onClick={() => {
                  setCancelModal(false);
                  setCancelReason("");
                  setCancelError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600">{cancelError}</p>
              </div>
            )}

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (required)"
              rows={3}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancelModal(false);
                  setCancelReason("");
                  setCancelError(null);
                }}
                disabled={cancelLoading}
                className="flex-1 px-3 py-2.5 border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading || !cancelReason.trim()}
                className="flex-1 px-3 py-2.5 bg-red-600 text-white font-medium text-xs sm:text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}