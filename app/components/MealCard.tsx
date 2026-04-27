import { useState } from "react";
import { Plus, Minus, AlertCircle, Star, Clock, Flame } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";   // ✅ Next.js correct import

interface MealImage {
  url: string;
  key: string;
}

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

const getTagColor = (name: string) =>
  TAG_COLORS[name] ?? "bg-gray-50 text-gray-500 border-gray-100";

export function MealCard({ meal }: { meal: Meal }) {
  const [showQuantity, setShowQuantity] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();                    // Next.js Router

  const { addToCart, removeFromCart, getQuantity, addingItems, error } = useCart();

  const quantity = getQuantity(meal._id);
  const isAdding = addingItems[meal._id];
  const hasDiscount = (meal.discountPercentage ?? 0) > 0;
  const displayPrice = hasDiscount ? meal.discountPrice : meal.price;

  // Improved Login Redirect with Return URL
  const redirectToLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleAddClick = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    await addToCart(meal._id, 1);
    setShowQuantity(true);
  };
  const handleQuantityChange = async (newQty: number) => {
    if (!user) {
      redirectToLogin();
      return;
    }
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all active:scale-[0.985] group h-full flex flex-col">
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
            <div className="flex items-center gap-1 bg-orange-50 rounded-xl px-1.5 py-1 border border-orange-200 flex-shrink-0">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isAdding}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="font-semibold text-orange-700 w-5 text-center text-xs sm:text-sm">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
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
  );
}