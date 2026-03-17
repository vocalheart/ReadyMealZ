"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Loader,
  AlertCircle,
  Calendar,
  Package,
  CheckCircle,
  Truck,
  Search,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import api from "../lib/axios";

interface OrderItem {
  meal: {
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  orderTotal: number;
  orderStatus:
    | "placed"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  estimatedDeliveryTime?: string;
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const statusConfig = {
  placed: {
    label: "Placed",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
    dotColor: "bg-blue-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-purple-100 text-purple-800",
    icon: CheckCircle,
    dotColor: "bg-purple-500",
  },
  preparing: {
    label: "Preparing",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
    dotColor: "bg-orange-500",
  },
  ready: {
    label: "Ready",
    color: "bg-yellow-100 text-yellow-800",
    icon: Package,
    dotColor: "bg-yellow-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-green-100 text-green-800",
    icon: Truck,
    dotColor: "bg-green-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    dotColor: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
    dotColor: "bg-red-500",
  },
};

/**
 * Orders List Page - Enhanced UI/UX
 * Fully responsive with mobile-first design (10px minimum text)
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log(" Fetching orders...");

        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        });

        if (filters.status) {
          params.append("status", filters.status);
        }

        const response = await api.get<OrdersResponse>(
          `/orders/my-orders?${params}`,
          {
            withCredentials: true,
          }
        );

        console.log(" Orders fetched:", response.data);

        if (response.data.success) {
          setOrders(response.data.data.orders);
          setPagination(response.data.data.pagination);
          setError(null);
        } else {
          setError(response.data.data?.message || "Failed to fetch orders");
        }
      } catch (err: any) {
        console.error("❌ Error fetching orders:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.page, filters.status, debouncedSearch]);

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getItemSummary = (items: OrderItem[]) => {
    if (items.length === 0) return "No items";
    if (items.length === 1) return `${items[0].meal.name}`;
    return `${items[0].meal.name} + ${items.length - 1} more`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="relative">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium text-xs sm:text-base">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition"
          >
            <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 rotate-180" />
            Back to Menu
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                Your Orders
              </h1>
              <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">
                Track and manage all your orders
              </p>
            </div>

            {orders.length > 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">
                  {pagination.total}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-xs sm:text-sm">Error</p>
              <p className="text-xs sm:text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Filters Card */}
        <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or item name..."
                value={filters.searchTerm}
                onChange={handleSearch}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white"
            >
              <option value=""> All Status</option>
              <option value="placed"> Placed</option>
              <option value="confirmed">✓ Confirmed</option>
              <option value="preparing"> Preparing</option>
              <option value="ready"> Ready</option>
              <option value="out_for_delivery"> Out for Delivery</option>
              <option value="delivered">✓ Delivered</option>
              <option value="cancelled">✗ Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-4 sm:p-6">
                <ShoppingBag className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-base sm:text-2xl font-bold text-gray-900 mb-2">
              No Orders Found
            </h2>
            <p className="text-xs sm:text-base text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-base rounded-lg hover:shadow-lg transition"
            >
              Browse Menu
              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => {
              const status =
                statusConfig[order.orderStatus as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              const totalItems = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-3 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold mb-1">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                            <Calendar className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${status.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Items</p>
                          <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                            {getItemSummary(order.items)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Qty: {totalItems}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="text-base sm:text-lg font-bold text-orange-600">
                            ₹{order.orderTotal}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.paymentStatus === "paid" ? "✓ Paid" : "• Pending"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {order.orderStatus === "out_for_delivery" && (
                            <Truck className="w-4 h-4 text-green-600 animate-pulse" />
                          )}
                          {order.orderStatus === "delivered" && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {order.orderStatus === "cancelled" && (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <p className="text-xs text-gray-600 font-medium">
                            {order.orderStatus === "placed" && " Just placed"}
                            {order.orderStatus === "confirmed" && "✓ Being prepared"}
                            {order.orderStatus === "preparing" && " Cooking your meal"}
                            {order.orderStatus === "ready" && " Ready for pickup"}
                            {order.orderStatus === "out_for_delivery" && " On the way"}
                            {order.orderStatus === "delivered" && "✓ Delivered"}
                            {order.orderStatus === "cancelled" && "Cancelled"}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid grid-cols-6 gap-6 items-center">
                      {/* Order Number & Date */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          ORDER #
                        </p>
                        <p className="font-bold text-gray-900 text-sm">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          ITEMS
                        </p>
                        <p className="font-medium text-gray-900 line-clamp-2 text-sm">
                          {getItemSummary(order.items)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Qty: {totalItems}</p>
                      </div>

                      {/* Total */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          TOTAL
                        </p>
                        <p className="font-bold text-orange-600 text-lg">
                          ₹{order.orderTotal}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {order.paymentStatus === "paid" ? "✓ Paid" : "• Pending"}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-2">
                          STATUS
                        </p>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </div>

                      {/* Progress */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-2">
                          PROGRESS
                        </p>
                        <div className="relative pt-1">
                          <div className="flex h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                order.orderStatus === "placed"
                                  ? "w-1/6 bg-blue-500"
                                  : order.orderStatus === "confirmed"
                                  ? "w-2/6 bg-purple-500"
                                  : order.orderStatus === "preparing"
                                  ? "w-3/6 bg-orange-500"
                                  : order.orderStatus === "ready"
                                  ? "w-4/6 bg-yellow-500"
                                  : order.orderStatus === "out_for_delivery"
                                  ? "w-5/6 bg-green-500"
                                  : order.orderStatus === "delivered"
                                  ? "w-full bg-green-500"
                                  : "w-full bg-red-500"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex justify-end">
                        <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm">
                          View
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{pagination.total}</span> orders
              </p>

              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-xs sm:text-sm text-gray-700 flex-shrink-0"
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return pageNum;
                    }
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold transition text-xs sm:text-sm flex-shrink-0 ${
                        pagination.page === page
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-xs sm:text-sm text-gray-700 flex-shrink-0"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}