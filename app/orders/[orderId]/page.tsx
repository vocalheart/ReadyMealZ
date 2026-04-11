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
  User,
  Home,
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

// ✅ Matches your Address.schema fields exactly
interface DeliveryAddress {
  _id: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
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
  deliveryAddress: DeliveryAddress;
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

const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
] as const;

const STATUS_LABELS: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "On the way",
  delivered: "Delivered",
};

const statusConfig = {
  placed: {
    icon: Package,
    label: "Order Placed",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
  },
  confirmed: {
    icon: CheckCircle,
    label: "Order Confirmed",
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
  },
  preparing: {
    icon: Package,
    label: "Preparing Your Order",
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
  },
  ready: {
    icon: Package,
    label: "Ready for Pickup",
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-600",
  },
  out_for_delivery: {
    icon: Truck,
    label: "Out for Delivery",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
  },
  cancelled: {
    icon: AlertCircle,
    label: "Order Cancelled",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
  },
};

const paymentMethodLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  online: "Credit / Debit Card",
  upi: "UPI Payment",
  wallet: "Digital Wallet",
};

const paymentStatusColor: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  paid: "text-green-700 bg-green-50 border-green-200",
  failed: "text-red-600 bg-red-50 border-red-200",
  refunded: "text-blue-600 bg-blue-50 border-blue-200",
};

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
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch order");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }
    setCancelLoading(true);
    setCancelError(null);
    try {
      const response = await api.patch(
        `/orders/${orderId}/cancel`,
        { reason: cancelReason.trim() },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOrder((prev) => (prev ? { ...prev, orderStatus: "cancelled" } : null));
        setCancelModal(false);
        setCancelReason("");
        setCancelSuccess(true);
        setTimeout(() => setCancelSuccess(false), 4000);
      } else {
        setCancelError(response.data.message || "Failed to cancel order");
      }
    } catch (err: any) {
      setCancelError(
        err.response?.data?.message || err.message || "Failed to cancel order"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-sm text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
            <Link href="/orders" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold text-sm rounded-lg hover:bg-orange-600 transition">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.orderStatus as keyof typeof statusConfig];
  const StatusIcon = statusInfo.icon;
  const canCancel = ["placed", "confirmed"].includes(order.orderStatus);
  const currentStatusIdx = ORDER_STATUSES.indexOf(order.orderStatus as any);

  // ── Address helpers ────────────────────────────────────────────────────────
  const addr = order.deliveryAddress;
  // Support both schema shapes gracefully
  const addrName = addr?.recipientName || (addr as any)?.name || "—";
  const addrPhone = addr?.phoneNumber || (addr as any)?.phone || "—";
  const addrFull = addr?.fullAddress || (addr as any)?.address || "—";
  const addrCity = addr?.city || "—";
  const addrState = addr?.state || "—";
  const addrPincode = addr?.pincode || "—";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

        {/* ── Back ── */}
        <Link href="/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4 sm:mb-6 text-xs sm:text-sm">
          <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
          Back to Orders
        </Link>

        {/* ── Cancel success toast ── */}
        {cancelSuccess && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">Order cancelled successfully.</p>
          </div>
        )}

        {/* ── Status header ── */}
        <div className={`rounded-xl sm:rounded-2xl border ${statusInfo.borderColor} ${statusInfo.bgColor} p-4 sm:p-8 mb-4 sm:mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <StatusIcon className={`w-5 sm:w-6 h-5 sm:h-6 ${statusInfo.textColor}`} />
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{statusInfo.label}</h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Order #{order.orderNumber}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition font-medium text-xs sm:text-sm text-gray-700 w-full sm:w-auto">
              <Download className="w-3 sm:w-4 h-3 sm:h-4" />
              Invoice
            </button>
          </div>

          {/* ── Progress tracker ── */}
          {order.orderStatus !== "cancelled" && (
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center gap-0">
                {ORDER_STATUSES.map((status, idx) => {
                  const isCompleted = currentStatusIdx >= idx;
                  const isCurrent = currentStatusIdx === idx;
                  return (
                    <React.Fragment key={status}>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : "bg-white border-gray-300"
                        } ${isCurrent ? "ring-2 ring-green-300 ring-offset-1" : ""}`} />
                        <span className={`text-xs mt-1 hidden sm:block text-center max-w-[60px] leading-tight ${
                          isCompleted ? "text-green-600 font-medium" : "text-gray-400"
                        }`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </div>
                      {idx < ORDER_STATUSES.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-0.5 sm:mx-1 transition-all ${
                          currentStatusIdx > idx ? "bg-green-500" : "bg-gray-300"
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {/* Mobile step label */}
              <p className="sm:hidden text-xs text-green-600 font-medium mt-2 text-center">
                {STATUS_LABELS[order.orderStatus] || order.orderStatus}
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* Order Items */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-8">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    {item.meal.images?.[0]?.url ? (
                      <img
                        src={item.meal.images[0].url}
                        alt={item.meal.name}
                        className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-base line-clamp-2">{item.meal.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-xs sm:text-sm font-semibold text-orange-600 mt-1">₹{item.price} each</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-xs sm:text-base">₹{item.totalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Delivery Address ── */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 sm:p-5 space-y-2 sm:space-y-3">
                {/* Recipient name */}
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <p className="font-semibold text-gray-900 text-xs sm:text-base">{addrName}</p>
                </div>

                {/* Full address */}
                <div className="flex items-start gap-2">
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-700 text-xs sm:text-sm">{addrFull}</p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                      {addrCity}, {addrState} – {addrPincode}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-700 text-xs sm:text-sm font-medium">{addrPhone}</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {order.specialRequests && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h2 className="text-sm sm:text-lg font-bold text-gray-900">Special Requests</h2>
                </div>
                <p className="text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs sm:text-sm leading-relaxed">
                  {order.specialRequests}
                </p>
              </div>
            )}

            {/* Status history (optional) */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-8">
                <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-4">Order Timeline</h2>
                <div className="space-y-3">
                  {[...order.statusHistory].reverse().map((entry, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400 mt-1 flex-shrink-0" />
                        {idx < order.statusHistory!.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="pb-3 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                          {entry.status.replace(/_/g, " ")}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-gray-500 mt-0.5">{entry.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(entry.timestamp).toLocaleString("en-IN", {
                            day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 sticky top-4 sm:top-24">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>

              {/* Breakdown */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-gray-900">
                    {order.deliveryCharge === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${Number(order.deliveryCharge).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  {/* ✅ Fixed: toFixed(2) removes floating point noise */}
                  <span className="font-medium text-gray-900">₹{Number(order.tax).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-4 sm:mb-5 text-sm sm:text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600">₹{Number(order.orderTotal).toFixed(2)}</span>
              </div>

              {/* Payment Status */}
              <div className="mb-3 space-y-2">
                <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${paymentStatusColor[order.paymentStatus] || "text-gray-700 bg-gray-100 border-gray-200"}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {paymentMethodLabel[order.paymentMethod] || order.paymentMethod}
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                {order.estimatedDeliveryTime && (
                  <div className="p-2.5 sm:p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-xs text-orange-500 mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-orange-700 text-xs sm:text-sm">
                      {new Date(order.estimatedDeliveryTime).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Cancel Button */}
              {canCancel && (
                <button
                  onClick={() => setCancelModal(true)}
                  className="w-full mt-2 px-3 py-2.5 bg-red-50 text-red-600 font-medium text-xs sm:text-sm rounded-lg hover:bg-red-100 border border-red-200 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cancel Modal ── */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => { setCancelModal(false); setCancelReason(""); setCancelError(null); }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Are you sure you want to cancel order <span className="font-semibold text-gray-800">#{order.orderNumber}</span>? This action cannot be undone.
            </p>

            {cancelError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600">{cancelError}</p>
              </div>
            )}

            <textarea
              value={cancelReason}
              onChange={(e) => { setCancelReason(e.target.value); setCancelError(null); }}
              placeholder="Reason for cancellation (required)"
              rows={3}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setCancelModal(false); setCancelReason(""); setCancelError(null); }}
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
                  <><Loader className="w-4 h-4 animate-spin" />Cancelling...</>
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