import { useState } from "react";
import { Plus, Minus, AlertCircle, Star, Clock, Flame } from "lucide-react";
import { useCart } from "../hooks/useCart";

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

/**
 * MealCard with integrated cart functionality
 * Handles add/remove from cart with quantity control
 */
export function MealCard({ meal }: { meal: Meal }) {
  const [showQuantity, setShowQuantity] = useState(false);

  // Guard against undefined meal
  if (!meal || !meal._id) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4">
        <p className="text-gray-500 text-center">Meal data unavailable</p>
      </div>
    );
  }

  const { addToCart, removeFromCart, getQuantity, addingItems, error } =
    useCart();

  const quantity = getQuantity(meal._id);
  const isAdding = addingItems[meal._id];
  const hasDiscount = (meal.discountPercentage ?? 0) > 0;
  const displayPrice = hasDiscount ? meal.discountPrice : meal.price;

  const handleAddClick = async () => {
    await addToCart(meal._id, 1);
    setShowQuantity(true);
  };

  const handleRemove = async () => {
    await removeFromCart(meal._id);
    if (quantity <= 1) {
      setShowQuantity(false);
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (newQty <= 0) {
      await removeFromCart(meal._id);
      setShowQuantity(false);
    } else {
      await addToCart(meal._id, newQty - quantity);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-40 sm:h-36 bg-gray-100 overflow-hidden">
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

        {/* Food type badge */}
        {meal.foodType && (
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm ${
              meal.foodType.name?.toLowerCase().includes("veg") &&
              !meal.foodType.name?.toLowerCase().includes("non")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {meal.foodType.name}
          </span>
        )}

        {/* Featured badge */}
        {meal.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" /> Featured
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
            {meal.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">
          {meal.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {meal.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2">
          {(meal.averageRating ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-400" />
              {meal.averageRating?.toFixed(1)}
            </span>
          )}
          {(meal.preparationTime ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {meal.preparationTime}m
            </span>
          )}
          {(meal.calories ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <Flame className="w-3 h-3" />
              {meal.calories} kcal
            </span>
          )}
        </div>

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {meal.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag.name)}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-sm font-bold text-orange-500">₹{displayPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ₹{meal.price}
              </span>
            )}
          </div>

          {/* Cart Controls */}
          {quantity === 0 ? (
            <button
              onClick={handleAddClick}
              disabled={isAdding || !meal.isAvailable}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-orange-50 rounded-lg px-2 py-1.5 border border-orange-200">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isAdding}
                className="text-orange-600 hover:text-orange-700 disabled:opacity-50 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-semibold text-orange-700 w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isAdding}
                className="text-orange-600 hover:text-orange-700 disabled:opacity-50 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 flex items-center gap-1.5 p-2 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-600 leading-tight">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}