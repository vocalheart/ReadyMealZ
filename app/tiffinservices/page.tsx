"use client";

import { useState, useEffect } from "react";
import axios from "../lib/axios";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Calendar,
  MapPin,
  CreditCard,
  Smartphone,
  DollarSign,
  Star,
  Check,
  Zap,
  Clock,
  Truck,
  Shield,
  TrendingDown,
  Loader,
  X,
} from "lucide-react";

/* ─── Types ─────────────────────────────────── */
type Plan = {
  id: string;
  label: string;
  days: number;
  pricePerMeal: number;
  total: number;
  savings: number | null;
  popular: boolean;
};

type MealTime = "lunch" | "dinner" | "both";

type TiffinService = {
  _id: string;
  name: string;
  description: string;
  htmlDescription?: string;
  image?: {
    url: string;
    key: string;
  };
  gallery?: Array<{
    url: string;
    key: string;
  }>;
  pricing: {
    basePrice: number;
    currency: string;
    tiers: Array<{
      name: "daily" | "weekly" | "monthly";
      price: number;
      discount: number;
    }>;
    bulkDiscount?: {
      minQuantity: number;
      discountPercentage: number;
    };
  };
  service: {
    deliveryDays: string[];
    deliveryTime: {
      start: string;
      end: string;
    };
    minDeliveryDistance: number;
    maxDeliveryDistance: number;
    isAvailable: boolean;
    prepareTime: number;
  };
  menuItems: Array<{
    name: string;
    description: string;
    category: "veg" | "non-veg" | "vegan" | "jain";
  }>;
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isJain: boolean;
    allergens: string[];
    noOfServings: number;
  };
  tags: string[];
  ratings: {
    average: number;
    totalReviews: number;
  };
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
};

const steps = ["Plan", "Timing", "Start Date", "Address", "Payment"];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
  </div>
);

/* ─── Landing Page ─────────────────────────── */
function LandingPage({
  onSelectService,
  tiffins,
  loading,
}: {
  onSelectService: (service: TiffinService) => void;
  tiffins: TiffinService[];
  loading: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTiffins =
    selectedCategory === "all"
      ? tiffins
      : tiffins.filter((t) =>
          selectedCategory === "vegetarian"
            ? t.dietary.isVegetarian
            : selectedCategory === "vegan"
            ? t.dietary.isVegan
            : selectedCategory === "jain"
            ? t.dietary.isJain
            : true
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-16 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full border border-orange-200">
          <span className="text-xs sm:text-sm font-semibold text-orange-600 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Fresh Tiffin Delivered Daily
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Delicious Meals at Your Doorstep
        </h1>
        <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
          Choose from our amazing variety of tiffin services and enjoy fresh,
          homemade meals delivered every day with guaranteed quality
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 sm:gap-6 justify-center mb-8 sm:mb-12">
          {[
            { icon: "⭐", text: "4.8+ Rating" },
            { icon: "🚚", text: "Free Delivery" },
            { icon: "🔒", text: "Quality Assured" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-lg sm:text-xl">{badge.icon}</span>
              <span className="font-semibold text-gray-700">{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      {!loading && tiffins.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {[
              { id: "all", label: "All" },
              { id: "vegetarian", label: "Vegetarian" },
              { id: "vegan", label: "Vegan" },
              { id: "jain", label: "Jain" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Service Cards Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
        {loading ? (
          <LoadingSpinner />
        ) : filteredTiffins.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm sm:text-lg">
              No tiffin services available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTiffins.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group transform hover:scale-105"
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
                  {service.image?.url ? (
                    <img
                      src={service.image.url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl">
                      🍛
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                    {service.service.isAvailable ? "Available" : "Unavailable"}
                  </div>

                  {/* Dietary Tags */}
                  <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
                    {service.dietary.isVegetarian && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        VEG
                      </span>
                    )}
                    {service.dietary.isVegan && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        VEGAN
                      </span>
                    )}
                    {service.dietary.isJain && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        JAIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 sm:w-4 h-3 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {service.ratings.average}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({service.ratings.totalReviews}+)
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-orange-100">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600">
                      ₹{service.pricing.basePrice}
                    </div>
                    <div className="text-xs text-gray-600">
                      {service.pricing.currency} / {service.dietary.noOfServings} servings
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Prep: {service.service.prepareTime} mins</span>
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => onSelectService(service)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm transform active:scale-95"
                  >
                    Subscribe Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ─── Step Indicator ───────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 px-4 overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border-2 transition-all ${
                    done
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : idx}
                </div>
                <span className={`mt-1 text-xs font-medium hidden sm:block ${active ? "text-gray-900" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mb-5 mx-1 ${
                    idx < current ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Order Summary ───────────────────────── */
function OrderSummary({
  service,
  plan,
  mealTime,
  startDate,
}: {
  service: TiffinService | null;
  plan: any | null;
  mealTime: MealTime | null;
  startDate: string;
}) {
  if (!service || !plan)
    return (
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
          Order Summary
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm">
          Select a plan to see your order summary.
        </p>
      </div>
    );

  const mealMultiplier = mealTime === "both" ? 2 : 1;
  const mealsTotal = plan.days * mealMultiplier;
  const subtotal = service.pricing.basePrice * mealsTotal;
  const savings = plan.savings || 0;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg sm:rounded-2xl shadow-sm border border-orange-200 p-4 sm:p-6 sticky top-24 sm:top-32">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
        {service.name}
      </h2>
      <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden mb-3 sm:mb-4 bg-gray-100 border border-orange-200">
        {service.image?.url && (
          <img
            src={service.image.url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm border-b border-orange-200 pb-3 sm:pb-4 mb-3 sm:mb-4">
        <div className="flex justify-between text-gray-700">
          <span>Plan</span>
          <span className="font-semibold text-gray-900">{plan.days} Days</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Price per meal</span>
          <span className="font-semibold text-gray-900">
            ₹{service.pricing.basePrice}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Total meals</span>
          <span className="font-semibold text-gray-900">{mealsTotal}</span>
        </div>
        {mealTime && (
          <div className="flex justify-between text-gray-700">
            <span>Meal time</span>
            <span className="font-semibold text-gray-900 capitalize">
              {mealTime}
            </span>
          </div>
        )}
        {startDate && (
          <div className="flex justify-between text-gray-700">
            <span>Start date</span>
            <span className="font-semibold text-gray-900">{startDate}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-3 sm:mb-4">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery</span>
          <span className="text-green-600 font-semibold">FREE</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-green-600 text-xs font-semibold">
            <span>Savings</span>
            <span>-₹{savings}</span>
          </div>
        )}
      </div>

      <div className="border-t border-orange-200 pt-3 sm:pt-4 flex justify-between items-center mb-4 sm:mb-6">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-xl sm:text-2xl font-bold text-orange-600">
          ₹{subtotal}
        </span>
      </div>

      {/* Delivery Info */}
      <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-200">
        <div className="font-semibold mb-2">📦 Delivery Details</div>
        <div className="space-y-1 text-xs">
          <div>Days: {service.service.deliveryDays.join(", ")}</div>
          <div>
            Time: {service.service.deliveryTime.start} -{" "}
            {service.service.deliveryTime.end}
          </div>
          <div>
            Distance: {service.service.minDeliveryDistance}-
            {service.service.maxDeliveryDistance} km
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Select Plan ───────────────────── */
function StepPlan({
  service,
  onSelect,
}: {
  service: TiffinService;
  onSelect: (p: any) => void;
}) {
  const dynamicPlans = [
    {
      id: "3days",
      label: "3 Days Plan",
      days: 3,
      savings: null,
      popular: false,
    },
    {
      id: "7days",
      label: "7 Days Plan",
      days: 7,
      savings: Math.floor(service.pricing.basePrice * 3.5),
      popular: true,
    },
    {
      id: "15days",
      label: "15 Days Plan",
      days: 15,
      savings: Math.floor(service.pricing.basePrice * 15),
      popular: false,
    },
    {
      id: "30days",
      label: "30 Days Plan",
      days: 30,
      savings: Math.floor(service.pricing.basePrice * 60),
      popular: false,
    },
  ].map((p) => ({
    ...p,
    pricePerMeal: service.pricing.basePrice,
    total: service.pricing.basePrice * p.days,
  }));

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Select Your Plan
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">
        Choose the duration that works best for you
      </p>
      <div className="space-y-3 sm:space-y-4">
        {dynamicPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan)}
            className="w-full text-left rounded-lg sm:rounded-xl px-4 sm:px-5 py-4 sm:py-5 border-2 flex items-center gap-3 sm:gap-4 transition-all hover:border-orange-300 hover:shadow-md bg-white border-gray-200 transform hover:scale-105"
          >
            <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0" />

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-gray-900">
                  {plan.label}
                </span>
                {plan.popular && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    Popular ⭐
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm mt-1 flex items-center gap-2 text-gray-500 flex-wrap">
                <span>₹{plan.pricePerMeal}/meal</span>
                <span>·</span>
                <span>Total: ₹{plan.total}</span>
                {plan.savings && (
                  <>
                    <span>·</span>
                    <span className="text-green-600 font-semibold">
                      Save ₹{plan.savings}
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 2: Timing ───────────────────────── */
function StepTiming({
  selected,
  onSelect,
}: {
  selected: MealTime | null;
  onSelect: (t: MealTime) => void;
}) {
  const options: {
    id: MealTime;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "lunch",
      label: "Lunch Only",
      desc: "Delivered by 12:30 PM",
      icon: <Sun className="w-5 h-5" />,
    },
    {
      id: "dinner",
      label: "Dinner Only",
      desc: "Delivered by 7:30 PM",
      icon: <Moon className="w-5 h-5" />,
    },
    {
      id: "both",
      label: "Lunch + Dinner",
      desc: "Both meals daily (2x meals)",
      icon: (
        <div className="flex gap-1">
          <Sun className="w-4 h-4" />
          <Moon className="w-4 h-4" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Choose Meal Timing
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">
        When would you like your meals delivered?
      </p>
      <div className="space-y-3 sm:space-y-4">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full text-left rounded-lg sm:rounded-xl px-4 sm:px-5 py-4 sm:py-5 border-2 flex items-center gap-3 sm:gap-4 transition-all transform hover:scale-105 ${
                isSelected
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg"
                  : "bg-white border-gray-200 hover:border-orange-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isSelected
                    ? "border-white"
                    : "border-gray-400"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <div
                className={`${
                  isSelected ? "text-white" : "text-orange-500"
                }`}
              >
                {opt.icon}
              </div>
              <div>
                <div
                  className={`font-semibold text-sm sm:text-base ${
                    isSelected ? "text-white" : "text-gray-900"
                  }`}
                >
                  {opt.label}
                </div>
                <div
                  className={`text-xs sm:text-sm ${
                    isSelected ? "text-orange-100" : "text-gray-500"
                  }`}
                >
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 3: Start Date ───────────────────── */
function StepStartDate({
  service,
  value,
  onChange,
}: {
  service: TiffinService;
  value: string;
  onChange: (v: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];

  const allowedDates = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    return service.service.deliveryDays.includes(dayName);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Choose Start Date
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">
        Select when you'd like your subscription to begin.
      </p>
      <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-4 sm:p-5">
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Start Date
        </label>
        <input
          type="date"
          min={today}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-xs sm:text-base text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
        {value && (
          <div>
            <p
              className={`mt-3 text-xs sm:text-sm font-semibold ${
                allowedDates(value) ? "text-green-600" : "text-red-600"
              }`}
            >
              {allowedDates(value) ? "✓" : "✗"}{" "}
              {new Date(value).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {!allowedDates(value) && (
              <p className="text-xs text-red-600 mt-2">
                Delivery only available on:{" "}
                {service.service.deliveryDays.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step 4: Address ───────────────────────– */
function StepAddress({
  address,
  onChange,
}: {
  address: Record<string, string>;
  onChange: (k: string, v: string) => void;
}) {
  const fields = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "Rahul Sharma",
      type: "text",
    },
    {
      key: "phone",
      label: "Phone Number",
      placeholder: "+91 98765 43210",
      type: "tel",
    },
    {
      key: "flat",
      label: "Flat / House No.",
      placeholder: "B-204, Sunshine Apartments",
      type: "text",
    },
    {
      key: "area",
      label: "Area / Street",
      placeholder: "Arera Colony, Zone 2",
      type: "text",
    },
    {
      key: "landmark",
      label: "Landmark (optional)",
      placeholder: "Near City Mall",
      type: "text",
    },
    { key: "pincode", label: "Pincode", placeholder: "462016", type: "text" },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Delivery Address
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">
        Where should we deliver your meals?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {fields.map((f) => (
          <div
            key={f.key}
            className={f.key === "flat" || f.key === "area" ? "sm:col-span-2" : ""}
          >
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={address[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 5: Payment ───────────────────────– */
function StepPayment({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  const methods = [
    {
      id: "upi",
      label: "UPI / GPay / PhonePe",
      desc: "Pay instantly via UPI",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      desc: "Visa, Mastercard, RuPay",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      desc: "Pay when meal arrives",
      icon: <DollarSign className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Payment Method
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">
        Choose how you'd like to pay.
      </p>
      <div className="space-y-3 sm:space-y-4">
        {methods.map((m) => {
          const isSelected = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`w-full text-left rounded-lg sm:rounded-xl px-4 sm:px-5 py-4 sm:py-5 border-2 flex items-center gap-3 sm:gap-4 transition-all transform hover:scale-105 ${
                isSelected
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg"
                  : "bg-white border-gray-200 hover:border-orange-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isSelected
                    ? "border-white"
                    : "border-gray-400"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <div
                className={`${
                  isSelected ? "text-white" : "text-orange-500"
                }`}
              >
                {m.icon}
              </div>
              <div>
                <div
                  className={`font-semibold text-sm sm:text-base ${
                    isSelected ? "text-white" : "text-gray-900"
                  }`}
                >
                  {m.label}
                </div>
                <div
                  className={`text-xs sm:text-sm ${
                    isSelected ? "text-orange-100" : "text-gray-500"
                  }`}
                >
                  {m.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected === "upi" && (
        <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl border border-gray-300 p-4 sm:p-5">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Enter UPI ID
          </label>
          <input
            type="text"
            placeholder="yourname@upi"
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </div>
      )}
      {selected === "card" && (
        <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl border border-gray-300 p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Expiry
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="password"
                placeholder="•••"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Success Screen ───────────────────────– */
function SuccessScreen({
  service,
  plan,
  onBackHome,
}: {
  service: TiffinService;
  plan: any | null;
  onBackHome: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center py-12 sm:py-16 max-w-md">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Subscription Confirmed! 🎉
        </h2>
        <p className="text-xs sm:text-base text-gray-600 mb-1">
          Your {plan?.days} days {service.name} subscription has been placed
          successfully.
        </p>
        <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-8">
          Fresh meals will start arriving at your doorstep soon.
        </p>
        <button
          onClick={onBackHome}
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition text-xs sm:text-base"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

/* ─── Checkout Header ───────────────────────– */
function CheckoutHeader({
  service,
  onBack,
}: {
  service: TiffinService | null;
  onBack: () => void;
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition p-1"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {service?.name || "Complete your subscription"}
          </p>
        </div>
      </div>
    </header>
  );
}

/* ─── Main App ───────────────────────────── */
export default function TiffinServiceApp() {
  const [currentPage, setCurrentPage] = useState<"landing" | "checkout">(
    "landing"
  );
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<TiffinService | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [mealTime, setMealTime] = useState<MealTime | null>("lunch");
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [submitted, setSubmitted] = useState(false);
  const [tiffins, setTiffins] = useState<TiffinService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiffins = async () => {
      try {
        const res = await axios.get("/public/tiffins");
        if (res.data.success) {
          setTiffins(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch tiffins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiffins();
  }, []);

  const handleSelectService = (service: TiffinService) => {
    setSelectedService(service);
    setCurrentPage("checkout");
    setStep(1);
    setSelectedPlan(null);
    setMealTime("lunch");
    setStartDate("");
    setAddress({});
    setPaymentMethod("upi");
    setSubmitted(false);
  };

  const handleBackToHome = () => {
    setCurrentPage("landing");
    setSelectedService(null);
    setStep(1);
    setSubmitted(false);
  };

  const canContinue = () => {
    if (step === 1) return !!selectedPlan;
    if (step === 2) return !!mealTime;
    if (step === 3)
      return (
        !!startDate &&
        (selectedService
          ? new Date(startDate).toLocaleString("en-US", {
              weekday: "long",
            }) &&
            selectedService.service.deliveryDays.includes(
              new Date(startDate).toLocaleString("en-US", { weekday: "long" })
            )
          : false)
      );
    if (step === 4)
      return !!(address.name &&
        address.phone &&
        address.flat &&
        address.area &&
        address.pincode);
    if (step === 5) return !!paymentMethod;
    return true;
  };

  const handleContinue = () => {
    if (step < 5) setStep(step + 1);
    else setSubmitted(true);
  };

  if (currentPage === "landing") {
    return (
      <LandingPage
        onSelectService={handleSelectService}
        tiffins={tiffins}
        loading={loading}
      />
    );
  }

  if (submitted) {
    return (
      <SuccessScreen
        service={selectedService!}
        plan={selectedPlan}
        onBackHome={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader service={selectedService} onBack={handleBackToHome} />

      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          {/* Main Card */}
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
            {step === 1 && selectedService && (
              <StepPlan service={selectedService} onSelect={setSelectedPlan} />
            )}
            {step === 2 && (
              <StepTiming selected={mealTime} onSelect={setMealTime} />
            )}
            {step === 3 && selectedService && (
              <StepStartDate
                service={selectedService}
                value={startDate}
                onChange={setStartDate}
              />
            )}
            {step === 4 && (
              <StepAddress
                address={address}
                onChange={(k, v) =>
                  setAddress((p) => ({ ...p, [k]: v }))
                }
              />
            )}
            {step === 5 && (
              <StepPayment
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
            )}

            {/* Navigation */}
            <div className="mt-6 sm:mt-8 flex gap-3 flex-col sm:flex-row">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-xs sm:text-base order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition text-xs sm:text-base order-1 sm:order-2 ${
                  canContinue()
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg transform active:scale-95"
                    : "bg-orange-300 cursor-not-allowed"
                }`}
              >
                {step === 5 ? "Place Order" : "Continue"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {selectedService && (
              <OrderSummary
                service={selectedService}
                plan={selectedPlan}
                mealTime={mealTime}
                startDate={startDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}