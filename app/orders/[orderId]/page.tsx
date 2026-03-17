"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Download,
  MessageSquare,
} from "lucide-react";
import api from "../.././lib/axios";

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
 */
export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <Link
              href="/orders"
              className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <Link
          href="/orders"
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Order Status Header */}
        <div className={`rounded-2xl border ${statusInfo.borderColor} ${statusInfo.bgColor} p-6 sm:p-8 mb-8`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon
                  className={`w-6 h-6 text-${statusInfo.color}-600`}
                />
                <h1 className="text-3xl font-bold text-gray-900">
                  {statusInfo.label}
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                Order #{order.orderNumber}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition font-medium text-gray-700">
              <Download className="w-4 h-4" />
              Invoice
            </button>
          </div>

          {/* Timeline */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
            {["placed", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"].map(
              (status, index) => (
                <React.Fragment key={status}>
                  <div
                    className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      ["placed", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"].indexOf(
                        order.orderStatus
                      ) >= index
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  {index < 5 && (
                    <div
                      className={`flex-shrink-0 h-1 w-12 ${
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    {/* Image */}
                    {item.meal.images?.[0]?.url && (
                      <img
                        src={item.meal.images[0].url}
                        alt={item.meal.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {item.meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-orange-600 mt-2">
                        ₹{item.price} each
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{item.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-orange-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">
                  {order.deliveryAddress.name}
                </p>
                <p className="text-gray-600">
                  {order.deliveryAddress.address}
                </p>
                <p className="text-gray-600">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                  {order.deliveryAddress.pincode}
                </p>
                <div className="flex items-center gap-2 text-gray-600 mt-3 pt-3 border-t border-gray-200">
                  <Phone className="w-4 h-4" />
                  <p>{order.deliveryAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {order.specialRequests && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Special Requests
                  </h2>
                </div>
                <p className="text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  {order.specialRequests}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">
                    {order.deliveryCharge === 0 ? "Free" : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.tax}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600">
                  ₹{order.orderTotal}
                </span>
              </div>

              {/* Payment Status */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.paymentStatus}
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </p>
              </div>

              {/* Order Date */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="font-semibold text-gray-900">
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

            {/* Actions */}
            {["placed", "confirmed"].includes(order.orderStatus) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <button className="w-full px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition">
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}