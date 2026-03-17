"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {ShoppingBag,ArrowRight,Loader,AlertCircle,Calendar,Package, CheckCircle, Truck, Filter,Search,} from "lucide-react";
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
  placed: { label: "Placed", color: "bg-blue-100 text-blue-800", icon: "📦" },
  confirmed: {
    label: "Confirmed",
    color: "bg-purple-100 text-purple-800",
    icon: "✓",
  },
  preparing: {
    label: "Preparing",
    color: "bg-orange-100 text-orange-800",
    icon: "🔪",
  },
  ready: { label: "Ready", color: "bg-yellow-100 text-yellow-800", icon: "📦" },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-green-100 text-green-800",
    icon: "🚚",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: "✓",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: "✗",
  },
};

/**
 * Orders List Page
 * Displays all orders with filtering and pagination
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

        if (response.data.success) {
          setOrders(response.data.data.orders);
          setPagination(response.data.data.pagination);
          setError(null);
        } else {
          setError(response.data.data?.message || "Failed to fetch orders");
        }
      } catch (err: any) {
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

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/menu"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Menu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-500 mt-2">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by order number or item name..."
                  value={filters.searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
              >
                <option value="">All Status</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Orders Found
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <Link
              href="/menu"
              className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status =
                statusConfig[order.orderStatus as keyof typeof statusConfig];

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-md transition block"
                >
                  <div className="grid sm:grid-cols-5 gap-4 sm:gap-6">
                    {/* Order Number & Date */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        ORDER NUMBER
                      </p>
                      <p className="font-bold text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        ITEMS
                      </p>
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {getItemSummary(order.items)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Qty: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
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
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        STATUS
                      </p>
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}
                      >
                        {status.icon} {status.label}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-end justify-end">
                      <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} orders
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-gray-700"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page }))
                    }
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      pagination.page === page
                        ? "bg-orange-500 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-700"
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
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}