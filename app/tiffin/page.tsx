"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  Loader,
  Calendar,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  User,
  AlertCircle,
  Phone,
  IndianRupee,
  CreditCard,
  TrendingUp,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Subscription {
  _id: string;
  tiffin?: {
    name: string;
    image?: { url: string };
  };
  plan?: {
    days: number;
    pricePerMeal: number;
    totalAmount: number;
    discount: number;
  };
  payment?: {
    method: string;
    status: string;
    transactionId: string;
  };
  delivery?: {
    totalMeals: number;
    deliveredMeals: number;
  };
  mealTime?: string;
  startDate?: string;
  endDate?: string;
  address?: {
    recipientName?: string;
    fullAddress: string;
    city: string;
    pincode: string;
    state?: string;
    phoneNumber?: string;
  };
  status: string;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; dotColor: string; label: string }> = {
  active:    { color: "bg-green-100 text-green-800",   dotColor: "bg-green-500",  label: "Active"    },
  pending:   { color: "bg-yellow-100 text-yellow-800", dotColor: "bg-yellow-500", label: "Pending"   },
  expired:   { color: "bg-gray-100 text-gray-600",     dotColor: "bg-gray-400",   label: "Expired"   },
  cancelled: { color: "bg-red-100 text-red-800",       dotColor: "bg-red-500",    label: "Cancelled" },
};

const paymentStatusConfig: Record<string, { color: string; label: string }> = {
  paid:    { color: "bg-green-100 text-green-700",  label: "Paid"    },
  pending: { color: "bg-yellow-100 text-yellow-700",label: "Pending" },
  failed:  { color: "bg-red-100 text-red-700",      label: "Failed"  },
};

export default function MySubscriptionsPage() {
  const [data, setData]       = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tiffin/my-subscriptions");
        setData(res.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "2-digit",
        })
      : "N/A";

  // ── Loading ──
  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium text-xs sm:text-base">Loading</p>
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
            <Link
              href="/tiffinservices"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition"
            >
              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 rotate-180" />
              Back to Tiffin Services
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                  My Subscriptions
                </h1>
                <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Manage your active tiffin plans
                </p>
              </div>
              {data.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Total Plans</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">
                    {data.length}
                  </p>
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

          {/* ── Empty State ── */}
          {data.length === 0 && !error ? (
            <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-full p-4 sm:p-6">
                  <Package className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
                </div>
              </div>
              <h2 className="text-base sm:text-2xl font-bold text-gray-900 mb-2">
                No Subscriptions Found
              </h2>
              <p className="text-xs sm:text-base text-gray-600 mb-6">
                You haven't subscribed to any tiffin service yet.
              </p>
              <Link
                href="/tiffinservices"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-base rounded-lg hover:shadow-lg transition"
              >
                Browse Tiffin Services
                <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
              </Link>
            </div>
          ) : (

            // ── Cards ──
            <div className="space-y-3 sm:space-y-4">
              {data.map((item) => {
                const st        = statusConfig[item.status] ?? statusConfig["active"];
                const pmtStatus = paymentStatusConfig[item.payment?.status ?? ""] ?? paymentStatusConfig["pending"];
                const delivered = item.delivery?.deliveredMeals ?? 0;
                const total     = item.delivery?.totalMeals ?? 1;
                const pct       = Math.min((delivered / total) * 100, 100);

                return (
                  <div
                    key={item._id}
                    className="block bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition overflow-hidden"
                  >
                    <div className="p-3 sm:p-6">

                      {/* ════ MOBILE LAYOUT ════ */}
                      <div className="sm:hidden space-y-3">

                        {/* Row 1 – image + name + badge */}
                        <div className="flex items-start gap-3">
                          {item.tiffin?.image?.url ? (
                            <img
                              src={item.tiffin.image.url}
                              alt={item.tiffin?.name}
                              className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl border border-gray-100 bg-orange-50 flex items-center justify-center flex-shrink-0">
                              <Package className="w-6 h-6 text-orange-300" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate">
                              {item.tiffin?.name || "Tiffin Plan"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${st.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dotColor}`} />
                            {st.label}
                          </span>
                        </div>

                        {/* Row 2 – key stats */}
                        <div className="grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> Duration
                            </p>
                            <p className="text-xs font-semibold text-gray-900 mt-0.5">
                              {item.plan?.days}d
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Meal Time</p>
                            <p className="text-xs font-semibold text-gray-900 mt-0.5 capitalize">
                              {item.mealTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 flex items-center gap-0.5 justify-end">
                              <IndianRupee className="w-3 h-3" /> Total
                            </p>
                            <p className="text-sm font-bold text-orange-600 mt-0.5">
                              ₹{item.plan?.totalAmount?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        {/* Row 3 – dates */}
                        <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Start
                            </p>
                            <p className="text-xs font-medium mt-0.5">{formatDate(item.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> End
                            </p>
                            <p className="text-xs font-medium mt-0.5">{formatDate(item.endDate)}</p>
                          </div>
                        </div>

                        {/* Row 4 – payment */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-600 capitalize">{item.payment?.method}</span>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pmtStatus.color}`}>
                            {pmtStatus.label}
                          </span>
                        </div>

                        {/* Row 5 – delivery progress */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Delivery Progress
                            </p>
                            <p className="text-xs font-semibold text-orange-600">
                              {delivered}/{total} meals
                            </p>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Row 6 – address */}
                        {item.address && (
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
                              <MapPin className="w-3 h-3" /> Delivery Address
                            </p>
                            {item.address.recipientName && (
                              <p className="text-xs font-medium flex items-center gap-1 mb-0.5">
                                <User className="w-3 h-3 text-gray-400" />
                                {item.address.recipientName}
                              </p>
                            )}
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {item.address.fullAddress}, {item.address.city} – {item.address.pincode}
                            </p>
                            {item.address.phoneNumber && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {item.address.phoneNumber}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ════ DESKTOP LAYOUT ════ */}
                      <div className="hidden sm:grid grid-cols-12 gap-6 items-start">

                        {/* Col 1 – image + name + status */}
                        <div className="col-span-3 flex flex-col items-center text-center">
                          {item.tiffin?.image?.url ? (
                            <img
                              src={item.tiffin.image.url}
                              alt={item.tiffin?.name}
                              className="w-28 h-28 object-cover rounded-2xl border border-gray-100 shadow-sm mb-3"
                            />
                          ) : (
                            <div className="w-28 h-28 rounded-2xl border border-gray-100 bg-orange-50 flex items-center justify-center mb-3">
                              <Package className="w-10 h-10 text-orange-300" />
                            </div>
                          )}
                          <p className="font-bold text-sm text-gray-900">
                            {item.tiffin?.name || "Tiffin Plan"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </p>
                          <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${st.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dotColor}`} />
                            {st.label}
                          </span>
                        </div>

                        {/* Col 2 – plan details + address */}
                        <div className="col-span-5 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> DURATION
                              </p>
                              <p className="font-semibold text-lg mt-0.5">{item.plan?.days} Days</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">MEAL TIME</p>
                              <p className="font-semibold text-lg mt-0.5 capitalize">{item.mealTime}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> START DATE
                              </p>
                              <p className="font-medium mt-0.5 text-sm">{formatDate(item.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> END DATE
                              </p>
                              <p className="font-medium mt-0.5 text-sm">{formatDate(item.endDate)}</p>
                            </div>
                          </div>

                          {item.address && (
                            <div className="bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
                              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 mb-2">
                                <MapPin className="w-3.5 h-3.5" /> DELIVERY ADDRESS
                              </p>
                              {item.address.recipientName && (
                                <p className="font-medium flex items-center gap-1.5 mb-1 text-sm">
                                  <User className="w-3.5 h-3.5 text-gray-400" />
                                  {item.address.recipientName}
                                </p>
                              )}
                              <p className="text-gray-700 leading-relaxed text-xs">
                                {item.address.fullAddress}, {item.address.city} – {item.address.pincode}
                              </p>
                              {item.address.state && (
                                <p className="text-gray-500 mt-1 text-xs">{item.address.state}</p>
                              )}
                              {item.address.phoneNumber && (
                                <p className="text-gray-500 mt-1.5 flex items-center gap-1 text-xs">
                                  <Phone className="w-3.5 h-3.5" /> {item.address.phoneNumber}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Col 3 – payment + progress */}
                        <div className="col-span-4 bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
                          {/* Pricing */}
                          <div>
                            <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5" /> TOTAL AMOUNT PAID
                            </p>
                            <p className="text-2xl font-bold text-orange-600 mt-1">
                              ₹{item.plan?.totalAmount?.toLocaleString("en-IN")}
                            </p>
                            {(item.plan?.discount ?? 0) > 0 && (
                              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Discount: ₹{item.plan!.discount}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              ₹{item.plan?.pricePerMeal} × {total} meals
                            </p>
                          </div>

                          {/* Payment method */}
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 mb-2">
                              <CreditCard className="w-3.5 h-3.5" /> PAYMENT
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold capitalize text-sm">
                                {item.payment?.method}
                              </p>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pmtStatus.color}`}>
                                {pmtStatus.label}
                              </span>
                            </div>
                            {item.payment?.transactionId && (
                              <p className="text-xs text-gray-400 mt-1.5 font-mono truncate">
                                {item.payment.transactionId}
                              </p>
                            )}
                          </div>

                          {/* Delivery progress */}
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" /> DELIVERY PROGRESS
                              </span>
                              <span className="font-semibold text-orange-600 text-sm">
                                {delivered} / {total}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">{Math.round(pct)}% delivered</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}