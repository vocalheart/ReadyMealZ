"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, ArrowRight, Loader, AlertCircle, Calendar,
  Package, CheckCircle, Truck, Search, Clock, CreditCard,
  ChevronLeft, ChevronRight, RotateCcw, Zap,
} from "lucide-react";
import api from "../lib/axios";
import ProtectedRoute from "../components/ProtectedRoute";

/* ─── Types ──────────────────────────────────── */
interface OrderItem {
  meal: { name: string; price: number; };
  name?: string;   // schema snapshot field — prefer this
  quantity: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  deliveryCharge: number;
  surgeCharge: number;
  packagingCharge: number;
  orderTotal: number;
  orderStatus:
    | "placed" | "confirmed" | "preparing" | "ready"
    | "out_for_delivery" | "delivered" | "cancelled" | "returned";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cod" | "online" | "upi" | "wallet";
  createdAt: string;
  estimatedDeliveryTime?: string;
  cancelReason?: string | null;
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
  };
}

/* ─── Status config ──────────────────────────── */
const statusConfig = {
  placed:           { label: "Placed",           color: "bg-blue-100 text-blue-800",    icon: Package,     dotColor: "bg-blue-500",   progress: "w-1/6"  },
  confirmed:        { label: "Confirmed",         color: "bg-purple-100 text-purple-800",icon: CheckCircle, dotColor: "bg-purple-500", progress: "w-2/6"  },
  preparing:        { label: "Preparing",         color: "bg-orange-100 text-orange-800",icon: Clock,       dotColor: "bg-orange-500", progress: "w-3/6"  },
  ready:            { label: "Ready",             color: "bg-yellow-100 text-yellow-800",icon: Package,     dotColor: "bg-yellow-500", progress: "w-4/6"  },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-green-100 text-green-800",  icon: Truck,       dotColor: "bg-green-500",  progress: "w-5/6"  },
  delivered:        { label: "Delivered",         color: "bg-green-100 text-green-800",  icon: CheckCircle, dotColor: "bg-green-500",  progress: "w-full" },
  cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-800",      icon: AlertCircle, dotColor: "bg-red-500",    progress: "w-full" },
  returned:         { label: "Returned",          color: "bg-gray-100 text-gray-700",    icon: RotateCcw,   dotColor: "bg-gray-400",   progress: "w-full" },
};

const paymentMethodLabel: Record<string, string> = {
  cod: "COD", online: "Card", upi: "UPI", wallet: "Wallet",
};

/* ─── Smart time helper ──────────────────────── */
function getSmartTime(dateString: string): { label: string; highlight: boolean } {
  const now  = new Date();
  const date = new Date(dateString);
  const diffMs  = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr  = Math.floor(diffMin / 60);

  // within 5 minutes — show "Just now" highlighted
  if (diffMin < 5) {
    return { label: "Just now", highlight: true };
  }
  // within 60 minutes — show "X min ago"
  if (diffMin < 60) {
    return { label: `${diffMin} min ago`, highlight: false };
  }
  // today — show time
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) {
    return {
      label: `Today, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
      highlight: false,
    };
  }
  // yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) {
    return {
      label: `Yesterday, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
      highlight: false,
    };
  }
  // older — show date
  return {
    label: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }),
    highlight: false,
  };
}

/* ─── Status message helper ──────────────────── */
function getStatusMessage(order: Order): string {
  switch (order.orderStatus) {
    case "placed":          return "Order received";
    case "confirmed":       return "Confirmed by restaurant";
    case "preparing":       return "Cooking your meal";
    case "ready":           return "Ready for pickup";
    case "out_for_delivery":return "On the way to you";
    case "delivered":       return "Delivered successfully";
    case "cancelled":       return order.cancelReason ? `Cancelled: ${order.cancelReason}` : "Order cancelled";
    case "returned":        return "Order returned";
    default:                return "";
  }
}

/* ─── Item summary ───────────────────────────── */
function getItemSummary(items: OrderItem[]): string {
  if (!items?.length) return "No items";
  // prefer schema name snapshot
  const first = items[0]?.name || items[0]?.meal?.name || "Meal";
  return items.length === 1 ? first : `${first} +${items.length - 1} more`;
}

/* ─── Component ──────────────────────────────── */
export default function OrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters]       = useState({ status: "", searchTerm: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [, setTick] = useState(0); // forces re-render every minute to keep time labels fresh

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.searchTerm), 500);
    return () => clearTimeout(t);
  }, [filters.searchTerm]);

  // Re-render every 60s so "X min ago" labels stay accurate
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page: pagination.page.toString(), limit: pagination.limit.toString() });
        if (filters.status) params.append("status", filters.status);
        if (debouncedSearch) params.append("search", debouncedSearch);

        const res = await api.get<OrdersResponse>(`/orders/my-orders?${params}`, { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.data.orders);
          setPagination(res.data.data.pagination);
          setError(null);
        } else {
          setError((res.data.data as any)?.message || "Failed to fetch orders");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [pagination.page, filters.status, debouncedSearch]);

  const handleStatusFilter = (status: string) => {
    setFilters(p => ({ ...p, status }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(p => ({ ...p, searchTerm: e.target.value }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  /* ── Loading ── */
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium text-xs sm:text-base">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

          {/* ── Header ── */}
          <div className="mb-6 sm:mb-8">
            <Link href="/menu" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition">
              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 rotate-180" />
              Back to Menu
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Your Orders</h1>
                <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">Track and manage all your orders</p>
              </div>
              {orders.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{pagination.total}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-xs sm:text-sm">Error</p>
                <p className="text-xs sm:text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* ── Filters ── */}
          <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-5 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or item name..."
                  value={filters.searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
              {/* Status filter */}
              <select
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="sm:w-52 px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition bg-white"
              >
                <option value="">All Status</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>

          {/* ── Empty state ── */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-full p-4 sm:p-6">
                  <ShoppingBag className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
                </div>
              </div>
              <h2 className="text-base sm:text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
              <p className="text-xs sm:text-base text-gray-600 mb-6">
                {filters.status || filters.searchTerm
                  ? "No orders match your filters. Try clearing them."
                  : "You haven't placed any orders yet. Start shopping!"}
              </p>
              {(filters.status || filters.searchTerm) ? (
                <button
                  onClick={() => { setFilters({ status: "", searchTerm: "" }); }}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg transition"
                >
                  Clear Filters
                </button>
              ) : (
                <Link href="/menu" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-base rounded-lg hover:shadow-lg transition">
                  Browse Menu <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* ── Orders list ── */}
              <div className="space-y-3 sm:space-y-3">
                {orders.map((order) => {
                  const status     = statusConfig[order.orderStatus as keyof typeof statusConfig] ?? statusConfig.placed;
                  const StatusIcon = status.icon;
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                  const timeInfo   = getSmartTime(order.createdAt);
                  const isCancelled = order.orderStatus === "cancelled" || order.orderStatus === "returned";
                  const isDelivered = order.orderStatus === "delivered";
                  const isActive    = ["placed", "confirmed", "preparing", "ready", "out_for_delivery"].includes(order.orderStatus);
                  const hasSurge    = Number(order.surgeCharge ?? 0) > 0;

                  return (
                    <Link
                      key={order._id}
                      href={`/orders/${order._id}`}
                      className={`block bg-white rounded-lg sm:rounded-xl border transition-all overflow-hidden group
                        ${isCancelled
                          ? "border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100"
                          : isActive
                          ? "border-orange-200 hover:border-orange-400 hover:shadow-md"
                          : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                        }`}
                    >
                      {/* Active order top accent bar */}
                      {isActive && (
                        <div className="h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 w-full" />
                      )}

                      <div className="p-3 sm:p-5">

                        {/* ══ MOBILE LAYOUT ══ */}
                        <div className="sm:hidden space-y-3">
                          {/* Row 1 — order number + status badge */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold tracking-wider">ORDER</p>
                              <p className="text-xs font-bold text-gray-900">#{order.orderNumber}</p>
                            </div>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${status.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${isActive ? "animate-pulse" : ""}`} />
                              {status.label}
                            </span>
                          </div>

                          {/* Row 2 — items + total */}
                          <div className="flex items-center justify-between gap-3 py-2 border-y border-gray-100">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{getItemSummary(order.items)}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-orange-600">₹{Number(order.orderTotal).toFixed(2)}</p>
                              <p className={`text-[10px] font-medium mt-0.5 ${order.paymentStatus === "paid" ? "text-green-600" : order.paymentStatus === "failed" ? "text-red-500" : "text-gray-400"}`}>
                                {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus === "failed" ? "✗ Failed" : "• Pending"}
                                {order.paymentMethod ? ` · ${paymentMethodLabel[order.paymentMethod] || ""}` : ""}
                              </p>
                            </div>
                          </div>

                          {/* Row 3 — time + status message + arrow */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                              {/* Smart time */}
                              <p className={`text-[10px] font-semibold flex items-center gap-1 ${timeInfo.highlight ? "text-orange-500" : "text-gray-400"}`}>
                                {timeInfo.highlight && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />}
                                <Clock className="w-3 h-3" />
                                {timeInfo.label}
                              </p>
                              {/* Status message */}
                              <p className={`text-[10px] ${isCancelled ? "text-red-500" : isDelivered ? "text-green-600" : "text-gray-500"}`}>
                                {getStatusMessage(order)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {hasSurge && <Zap className="w-3 h-3 text-orange-400" />}
                              <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>

                          {/* Progress bar (active orders only) */}
                          {!isCancelled && (
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${
                                isDelivered ? "bg-green-500" : "bg-orange-500"
                              } ${status.progress}`} />
                            </div>
                          )}
                        </div>

                        {/* ══ DESKTOP LAYOUT ══ */}
                        <div className="hidden sm:flex items-center gap-5">

                          {/* Order # + date */}
                          <div className="w-36 flex-shrink-0">
                            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-0.5">ORDER #</p>
                            <p className="font-bold text-gray-900 text-sm truncate">{order.orderNumber}</p>
                            {/* Smart time */}
                            <p className={`text-xs mt-1.5 flex items-center gap-1 font-medium ${timeInfo.highlight ? "text-orange-500" : "text-gray-400"}`}>
                              {timeInfo.highlight && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />}
                              <Clock className="w-3 h-3" />
                              {timeInfo.label}
                            </p>
                          </div>

                          {/* Items */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-0.5">ITEMS</p>
                            <p className="font-medium text-gray-900 text-sm truncate">{getItemSummary(order.items)}</p>
                            <p className="text-xs text-gray-400 mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                          </div>

                          {/* Total + payment */}
                          <div className="w-28 flex-shrink-0">
                            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-0.5">TOTAL</p>
                            <p className="font-bold text-orange-600 text-base">₹{Number(order.orderTotal).toFixed(2)}</p>
                            <p className={`text-xs mt-1 font-medium ${order.paymentStatus === "paid" ? "text-green-600" : order.paymentStatus === "failed" ? "text-red-500" : "text-gray-400"}`}>
                              {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus === "failed" ? "✗ Failed" : "• Pending"}
                              {order.paymentMethod ? ` · ${paymentMethodLabel[order.paymentMethod]}` : ""}
                            </p>
                          </div>

                          {/* Status badge */}
                          <div className="w-36 flex-shrink-0">
                            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-1.5">STATUS</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${isActive ? "animate-pulse" : ""}`} />
                              {status.label}
                            </span>
                            {hasSurge && (
                              <p className="text-[10px] text-orange-500 flex items-center gap-0.5 mt-1">
                                <Zap className="w-2.5 h-2.5" /> Surge applied
                              </p>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="w-24 flex-shrink-0">
                            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-2">PROGRESS</p>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${
                                isCancelled ? "bg-red-400" : isDelivered ? "bg-green-500" : "bg-orange-500"
                              } ${status.progress}`} />
                            </div>
                            <p className={`text-[10px] mt-1.5 ${isCancelled ? "text-red-400" : isDelivered ? "text-green-600" : "text-gray-400"}`}>
                              {getStatusMessage(order)}
                            </p>
                          </div>

                          {/* CTA */}
                          <div className="flex-shrink-0">
                            <button className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold text-sm group-hover:gap-2 transition-all">
                              View
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* ── Pagination ── */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-3 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-semibold text-gray-800">{(pagination.page - 1) * pagination.limit + 1}</span>
                      {" "}–{" "}
                      <span className="font-semibold text-gray-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                      {" "}of{" "}
                      <span className="font-semibold text-gray-800">{pagination.total}</span> orders
                    </p>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button
                        onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                        disabled={pagination.page === 1}
                        className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                          let p: number;
                          if (pagination.totalPages <= 5)           p = i + 1;
                          else if (pagination.page <= 3)            p = i + 1;
                          else if (pagination.page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                          else                                      p = pagination.page - 2 + i;
                          return p;
                        }).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm transition flex-shrink-0 ${
                              pagination.page === p
                                ? "bg-orange-500 text-white shadow-sm"
                                : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}