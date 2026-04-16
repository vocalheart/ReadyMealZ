"use client";

import { useState, useEffect } from "react";
import axios from "../lib/axios";
import {
  ArrowRight,
  Star,
  Clock,
  Zap,
  Loader,
  Truck,
  ShieldCheck,
  UtensilsCrossed,
  Leaf,
  Sprout,
  FlameKindling,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";


/* ─── Types ─────────────────────────────────── */
type TiffinService = {
  _id: string;
  name: string;
  description: string;
  image?: {
    url: string;
    key: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
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
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isJain: boolean;
    noOfServings: number;
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
};

/* ─── Loading Spinner ───────────────────────── */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <Loader className="w-10 h-10 text-orange-500 animate-spin" />
  </div>
);

/* ─── Image Fallback ────────────────────────── */
const ImageFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
    <UtensilsCrossed className="w-14 h-14 text-orange-300" />
  </div>
);

/* ─── Main Page ──────────────────────────────── */
export default function TiffinPage() {
  const [tiffins, setTiffins] = useState<TiffinService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  const user = useSelector((state: any) => state.auth.user);
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

  const trustBadges = [
    {
      icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />,
      text: "4.8+ Rating",
    },
    {
      icon: <Truck className="w-4 h-4 text-orange-500" />,
      text: "Free Delivery",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-green-500" />,
      text: "Quality Assured",
    },
  ];

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
          homemade meals delivered every day with guaranteed quality.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 sm:gap-6 justify-center mb-8 sm:mb-12">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
              {badge.icon}
              <span className="font-semibold text-gray-700">{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filters */}
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
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all ${selectedCategory === cat.id
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Tiffin Cards Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
        {loading ? (
          <LoadingSpinner />
        ) : filteredTiffins.length === 0 ? (
          <div className="text-center py-16">
            <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-lg">
              No tiffin services available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTiffins.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  {service.image?.url ? (
                    <img
                      src={service.image.url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageFallback />
                  )}

                  {/* Availability Badge */}
                  <div
                    className={`absolute top-3 right-3 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white ${service.service.isAvailable ? "bg-green-500" : "bg-red-500"
                      }`}
                  >
                    {service.service.isAvailable ? "Available" : "Unavailable"}
                  </div>

                  {/* Dietary Tags */}
                  <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
                    {service.dietary.isVegetarian && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> VEG
                      </span>
                    )}
                    {service.dietary.isVegan && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <Sprout className="w-3 h-3" /> VEGAN
                      </span>
                    )}
                    {service.dietary.isJain && (
                      <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <FlameKindling className="w-3 h-3" /> JAIN
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
                  <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-orange-100">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600">
                      ₹{service.pricing.basePrice}
                    </div>
                    <div className="text-xs text-gray-500">
                      {service.pricing.currency} / {service.dietary.noOfServings} servings
                    </div>
                  </div>

                  {/* Prep Time */}
                  <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Prep time: {service.service.prepareTime} mins</span>
                  </div>

                  {/* Subscribe Button */}
                  <button
                    disabled={!service.service.isAvailable}
                    onClick={() => {
                      if (!service.service.isAvailable) return;
                      if (!user) {
                        router.push("/login");
                        return;
                      }

                      router.push(`/tiffin/${service._id}?subscribe=true`);
                    }}
                    className={`w-full font-semibold py-2.5 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${service.service.isAvailable
                        ? "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {service.service.isAvailable ? (
                      <>
                        Subscribe Now <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      "Currently Unavailable"
                    )}
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