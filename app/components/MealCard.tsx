"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Minus, AlertCircle, Star, Clock, Flame, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import api from "../lib/axios";

/* ─── Types ─────────────────────────────────── */
interface MealImage {
  url: string;
  key: string;
  altText?: string;
};
interface Category {
  _id: string;
  name: string;
  slug?: string;
  mealCount?: number;
}

interface FoodType {
  _id: string;
  name: string;
}
interface Tag {
  _id: string;
  name: string;
}
interface MealDetail {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  discountPercentage?: number;
  discountPrice?: number;
  category?: Category;
  foodType?: FoodType;
  tags?: Tag[];
  images: MealImage[];
  isAvailable: boolean;
  isFeatured: boolean;
  averageRating?: number;
  totalReviews?: number;
  preparationTime?: number;
  calories?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };
  ratingBreakdown?: {
    five?: number;
    four?: number;
    three?: number;
    two?: number;
    one?: number;
  };
  servingSize?: string;
  servingsPerItem?: number;
  allergens?: string[];
  dietaryFlags?: string[];
}
interface Meal {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  discountPercentage?: number;
  discountPrice?: number;
  category?: Category;
  foodType?: FoodType;
  tags?: Tag[];
  images: MealImage[];
  isAvailable: boolean;
  isFeatured: boolean;
  averageRating?: number;
  totalReviews?: number;
  preparationTime?: number;
  calories?: number;
}

/* ─── Tag Colors ─────────────────────────────── */
const TAG_COLORS: Record<string, string> = {
  Popular: "bg-blue-50 text-blue-600 border-blue-100",
  "High Protein": "bg-purple-50 text-purple-600 border-purple-100",
  Bestseller: "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Chef Special": "bg-pink-50 text-pink-600 border-pink-100",
  Spicy: "bg-red-50 text-red-600 border-red-100",
  "North Indian": "bg-orange-50 text-orange-600 border-orange-100",
  "Comfort Food": "bg-green-50 text-green-600 border-green-100",
  "Coastal Special": "bg-teal-50 text-teal-600 border-teal-100",
};
const getTagColor = (name: string) => TAG_COLORS[name] ?? "bg-gray-50 text-gray-500 border-gray-100";

/* ─── Image Slider ───────────────────────────── */
function ImageSlider({
  images,
  name,
  isFeatured,
  foodType,
  hasDiscount,
  discountPercentage,
}: {
  images: MealImage[];
  name: string;
  isFeatured?: boolean;
  foodType?: FoodType;
  hasDiscount: boolean;
  discountPercentage?: number;
}) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = images.length;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCurrent((c) => (c + 1) % total);
      else setCurrent((c) => (c - 1 + total) % total);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeImg = images[current];

  return (
    <div
      className="relative h-52 sm:h-64 bg-gray-100 rounded-xl overflow-hidden mb-4 flex-shrink-0 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)`, width: `${total * 100}%` }}
      >
        {images.map((img, i) => (
          <div key={i} className="h-full flex-shrink-0" style={{ width: `${100 / total}%` }}>
            {img.url ? (
              <img
                src={img.url}
                alt={img.altText || name}
                className="w-full h-full object-cover"
                draggable={false}/>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next arrows — only show if multiple images */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all ${
                  i === current
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/40 text-white text-[10px] font-medium rounded-full backdrop-blur-sm">
            {current + 1}/{total}
          </span>
        </>
      )}

      {/* Badges */}
      {foodType && (
        <span
          className={`absolute top-3 ${total > 1 ? "right-10" : "right-3"} px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm ${
            foodType.name?.toLowerCase().includes("veg") &&
            !foodType.name?.toLowerCase().includes("non")
              ? "bg-green-500"
              : "bg-red-500"
          }`}
          style={total > 1 ? { right: "2.75rem" } : {}}
        >
          {foodType.name}
        </span>
      )}
      {isFeatured && (
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" /> Featured
        </span>
      )}
      {hasDiscount && (
        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full shadow-sm">
          {discountPercentage}% OFF
        </span>
      )}
    </div>
  );
}

/* ─── Nutrition Row ─────────────────────────── */
function NutritionRow({ label, value, unit }: { label: string; value?: number; unit: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-gray-800">{value}{unit}</span>
    </div>
  );
}
/* ─── Rating Bar ──────────────────────────────── */
function RatingBar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[11px] text-gray-500 w-4 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 w-4 text-right shrink-0">{value}</span>
    </div>
  );
}

/* ─── Detail Skeleton ────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-52 sm:h-64 bg-gray-100 rounded-xl mb-4" />
      <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-4/5 mb-4" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
      </div>
    </div>
  );
}

/* ─── Meal Detail Content ────────────────────── */
function MealDetailContent({
  meal,
  loading,
  onClose,
}: {
  meal: MealDetail | null;
  loading: boolean;
  onClose: () => void;
}) {
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();
  const { addToCart, removeFromCart, getQuantity, addingItems, error } = useCart();

  const redirectToLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  if (loading || !meal) return <DetailSkeleton />;

  const quantity = getQuantity(meal._id);
  const isAdding = addingItems[meal._id];
  const hasDiscount = (meal.discountPercentage ?? 0) > 0;
  const displayPrice = hasDiscount ? meal.discountPrice : meal.price;
  const totalRatings =
    (meal.ratingBreakdown?.five ?? 0) +
    (meal.ratingBreakdown?.four ?? 0) +
    (meal.ratingBreakdown?.three ?? 0) +
    (meal.ratingBreakdown?.two ?? 0) +
    (meal.ratingBreakdown?.one ?? 0);
  const hasNutrition =
    (meal.nutrition?.protein ?? 0) > 0 ||
    (meal.nutrition?.carbs ?? 0) > 0 ||
    (meal.nutrition?.fat ?? 0) > 0 ||
    (meal.nutrition?.calories ?? 0) > 0;

  const handleAddClick = async () => {
    if (!user) { redirectToLogin(); return; }
    await addToCart(meal._id, 1);
  };
  const handleQuantityChange = async (newQty: number) => {
    if (!user) { redirectToLogin(); return; }
    if (newQty <= 0) await removeFromCart(meal._id);
    else await addToCart(meal._id, newQty - quantity);
  };

  return (
    <div>
      {/* Image Slider */}
      <ImageSlider
        images={meal.images?.length > 0 ? meal.images : [{ url: "", key: "" }]}
        name={meal.name}
        isFeatured={meal.isFeatured}
        foodType={meal.foodType}
        hasDiscount={hasDiscount}
        discountPercentage={meal.discountPercentage}
      />
      {/* Name + Category */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{meal.name}</h2>
        {meal.category && (
          <span className="shrink-0 px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-semibold rounded-full">
            {meal.category.name}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-500 mb-3 leading-relaxed">{meal.description}</p>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(meal.averageRating ?? 0) > 0 && (
          <div className="bg-amber-50 rounded-xl p-2.5 flex flex-col items-center gap-0.5 border border-amber-100">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700">{meal.averageRating?.toFixed(1)}</span>
            <span className="text-[10px] text-amber-500">{meal.totalReviews} reviews</span>
          </div>
        )}
        {(meal.preparationTime ?? 0) > 0 && (
          <div className="bg-blue-50 rounded-xl p-2.5 flex flex-col items-center gap-0.5 border border-blue-100">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-700">{meal.preparationTime}m</span>
            <span className="text-[10px] text-blue-400">Prep time</span>
          </div>
        )}
        {(meal.nutrition?.calories ?? meal.calories ?? 0) > 0 && (
          <div className="bg-red-50 rounded-xl p-2.5 flex flex-col items-center gap-0.5 border border-red-100">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-700">{meal.nutrition?.calories ?? meal.calories}</span>
            <span className="text-[10px] text-red-400">Calories</span>
          </div>
        )}
      </div>
      {/* Tags */}
      {meal.tags && meal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {meal.tags.map((tag) => (
            <span
              key={tag._id}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${getTagColor(tag.name)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      {/* Nutrition */}
      {hasNutrition && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nutrition</p>
          <div className="bg-gray-50 rounded-xl px-3 py-1">
            <NutritionRow label="Protein" value={meal.nutrition?.protein} unit="g" />
            <NutritionRow label="Carbs" value={meal.nutrition?.carbs} unit="g" />
            <NutritionRow label="Fat" value={meal.nutrition?.fat} unit="g" />
            <NutritionRow label="Fiber" value={meal.nutrition?.fiber} unit="g" />
            <NutritionRow label="Sodium" value={meal.nutrition?.sodium} unit="mg" />
          </div>
        </div>
      )}

      {/* Rating breakdown */}
      {totalRatings > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rating breakdown</p>
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <RatingBar label="5★" value={meal.ratingBreakdown?.five ?? 0} total={totalRatings} />
            <RatingBar label="4★" value={meal.ratingBreakdown?.four ?? 0} total={totalRatings} />
            <RatingBar label="3★" value={meal.ratingBreakdown?.three ?? 0} total={totalRatings} />
            <RatingBar label="2★" value={meal.ratingBreakdown?.two ?? 0} total={totalRatings} />
            <RatingBar label="1★" value={meal.ratingBreakdown?.one ?? 0} total={totalRatings} />
          </div>
        </div>
      )}

      {/* Allergens */}
      {meal.allergens && meal.allergens.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Allergens</p>
          <div className="flex flex-wrap gap-1.5">
            {meal.allergens.map((a, i) => (
              <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-medium rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Serving info */}
      {(meal.servingSize || (meal.servingsPerItem ?? 0) > 1) && (
        <div className="mb-4 text-xs text-gray-400">
          {meal.servingSize && <span>Serving size: {meal.servingSize}</span>}
          {meal.servingsPerItem && meal.servingsPerItem > 1 && (
            <span className="ml-3">Servings per item: {meal.servingsPerItem}</span>
          )}
        </div>
      )}

      {/* Price + Cart */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-lg sm:text-xl font-bold text-orange-600 leading-tight">₹{displayPrice}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through leading-tight">₹{meal.price}</span>
          )}
        </div>

        {!meal.isAvailable ? (
          <span className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl">
            Unavailable
          </span>
        ) : quantity === 0 ? (
          <button
            onClick={handleAddClick}
            disabled={isAdding}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
          >
            {isAdding ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-2 py-1.5 border border-orange-200">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isAdding}
              className="w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold text-orange-700 w-6 text-center text-sm">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isAdding}
              className="w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-1.5 p-2 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Detail Modal (lg screen) ───────────────── */
function MealDetailModal({
  mealId,
  open,
  onClose,
}: {
  mealId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !mealId) return;
    setMeal(null);
    setLoading(true);
    api
      .get(`/user/meals/${mealId}`)
      .then((res) => {
        if (res.data.success) setMeal(res.data.meal);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, mealId]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Meal Details</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <MealDetailContent meal={meal} loading={loading} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

/* ─── Bottom Sheet (mobile) ───────────────────── */
function MealDetailBottomSheet({
  mealId,
  open,
  onClose,
}: {
  mealId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !mealId) return;
    setMeal(null);
    setLoading(true);
    api
      .get(`/user/meals/${mealId}`)
      .then((res) => {
        if (res.data.success) setMeal(res.data.meal);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, mealId]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={sheetRef}
        className="relative z-10 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
        style={{ animation: "slideUp 0.28s cubic-bezier(0.32,0.72,0,1)" }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">Meal Details</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <MealDetailContent meal={meal} loading={loading} onClose={onClose} />
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── MealCard ───────────────────────────────── */
export function MealCard({ meal }: { meal: Meal }) {
  const [showQuantity, setShowQuantity] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLg, setIsLg] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  const { addToCart, removeFromCart, getQuantity, addingItems, error } = useCart();

  const quantity = getQuantity(meal._id);
  const isAdding = addingItems[meal._id];
  const hasDiscount = (meal.discountPercentage ?? 0) > 0;
  const displayPrice = hasDiscount ? meal.discountPrice : meal.price;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const redirectToLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };
  const handleAddClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { redirectToLogin(); return; }
    await addToCart(meal._id, 1);
    setShowQuantity(true);
  };
  const handleQuantityChange = async (e: React.MouseEvent, newQty: number) => {
    e.stopPropagation();
    if (!user) { redirectToLogin(); return; }
    if (newQty <= 0) {
      await removeFromCart(meal._id);
      setShowQuantity(false);
    } else {
      await addToCart(meal._id, newQty - quantity);
    }
  };
  if (!meal || !meal._id) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-gray-500 text-center">Meal data unavailable</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Card ── */}
      <div
        onClick={() => setDetailOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all active:scale-[0.985] group h-full flex flex-col cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative h-32 sm:h-40 md:h-44 bg-gray-100 overflow-hidden flex-shrink-0">
          {meal.images?.[0]?.url ? (
            <img
              src={meal.images[0].url}
              alt={meal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {meal.foodType && (
            <span
              className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-semibold text-white shadow-sm ${
                meal.foodType.name?.toLowerCase().includes("veg") &&
                !meal.foodType.name?.toLowerCase().includes("non")
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {meal.foodType.name}
            </span>
          )}
          {meal.isFeatured && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-white text-[9px] font-semibold rounded-full shadow-sm flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-white" /> Featured
            </span>
          )}
          {hasDiscount && (
            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-sm">
              {meal.discountPercentage}% OFF
            </span>
          )}
          {/* Multiple images indicator on card */}
          {meal.images?.length > 1 && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/40 text-white text-[9px] font-medium rounded-full backdrop-blur-sm flex items-center gap-0.5">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/>
              </svg>
              {meal.images.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-1 sm:line-clamp-2">
            {meal.name}
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed flex-1">
            {meal.description}
          </p>
          <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-[10px] sm:text-xs flex-wrap">
            {(meal.averageRating ?? 0) > 0 && (
              <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                <Star className="w-3 h-3 fill-amber-400" />
                {meal.averageRating?.toFixed(1)}
              </span>
            )}
            {(meal.preparationTime ?? 0) > 0 && (
              <span className="flex items-center gap-0.5 text-gray-400">
                <Clock className="w-3 h-3" />
                {meal.preparationTime}m
              </span>
            )}
            {(meal.calories ?? 0) > 0 && (
              <span className="flex items-center gap-0.5 text-gray-400">
                <Flame className="w-3 h-3" />
                {meal.calories}
              </span>
            )}
          </div>
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {meal.tags.slice(0, 1).map((tag) => (
                <span
                  key={tag._id}
                  className={`sm:hidden px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${getTagColor(tag.name)}`}
                >
                  {tag.name}
                </span>
              ))}
              {meal.tags.slice(0, 3).map((tag) => (
                <span
                  key={`d-${tag._id}`}
                  className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${getTagColor(tag.name)}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Price & Cart Controls */}
          <div className="mt-auto pt-2.5 sm:pt-3 flex items-center justify-between gap-1">
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-orange-600 leading-tight">
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-gray-400 line-through leading-tight">
                  ₹{meal.price}
                </span>
              )}
            </div>
            {quantity === 0 ? (
              <button
                onClick={handleAddClick}
                disabled={isAdding || !meal.isAvailable}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
              >
                {isAdding ? (
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                Add
              </button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 bg-orange-50 rounded-xl px-1.5 py-1 border border-orange-200 flex-shrink-0"
              >
                <button
                  onClick={(e) => handleQuantityChange(e, quantity - 1)}
                  disabled={isAdding}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span className="font-semibold text-orange-700 w-5 text-center text-xs sm:text-sm">
                  {quantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(e, quantity + 1)}
                  disabled={isAdding}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-1.5 flex items-center gap-1 p-1.5 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              <p className="text-[10px] text-red-600 line-clamp-1">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail overlay ── */}
      {isLg ? (
        <MealDetailModal
          mealId={meal._id}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
      ) : (
        <MealDetailBottomSheet
          mealId={meal._id}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}