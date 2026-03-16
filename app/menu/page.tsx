"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Flame,
} from "lucide-react";
import api from "../lib/axios";
import { MealCard } from "../components/MealCard"; // Import the fixed component

/* ─── Types ─────────────────────────────────── */
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
interface MealImage {
  url: string;
  key: string;
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

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

/* ─── Skeleton Card ──────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between mt-3">
          <div className="h-5 bg-gray-100 rounded w-16" />
          <div className="h-7 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Panel ───────────────────────────── */
function FilterPanel({
  categories,
  foodTypes,
  allTags,
  selectedCategory,
  setSelectedCategory,
  selectedFoodType,
  setSelectedFoodType,
  selectedTags,
  toggleTag,
  clearFilters,
  loadingFilters,
}: {
  categories: Category[];
  foodTypes: FoodType[];
  allTags: Tag[];
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedFoodType: string;
  setSelectedFoodType: (f: string) => void;
  selectedTags: string[];
  toggleTag: (id: string) => void;
  clearFilters: () => void;
  loadingFilters: boolean;
}) {
  if (loadingFilters) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded w-3/4" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Categories
        </p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => setSelectedCategory("")}
              className="accent-orange-500 w-3.5 h-3.5"
            />
            <span className="text-sm text-gray-600">All Items</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat._id}
                onChange={() => setSelectedCategory(cat._id)}
                className="accent-orange-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-600">{cat.name}</span>
              {cat.mealCount !== undefined && (
                <span className="ml-auto text-xs text-gray-400">
                  {cat.mealCount}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Food Type */}
      {foodTypes.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Food Type
          </p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="foodtype"
                checked={selectedFoodType === ""}
                onChange={() => setSelectedFoodType("")}
                className="accent-orange-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-600">All</span>
            </label>
            {foodTypes.map((ft) => (
              <label key={ft._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="foodtype"
                  checked={selectedFoodType === ft._id}
                  onChange={() => setSelectedFoodType(ft._id)}
                  className="accent-orange-500 w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-600">{ft.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tags
          </p>
          <div className="space-y-1.5">
            {allTags.map((tag) => (
              <label key={tag._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => toggleTag(tag._id)}
                  className="accent-orange-500 w-3.5 h-3.5 rounded"
                />
                <span className="text-sm text-gray-600">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={clearFilters}
        className="w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}

/* ─── Main Menu Page ──────────────────────────── */
export default function MenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState("");

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersMounted = useRef(false);

  /* ── Load all filters in ONE call → /user/filters ── */
  useEffect(() => {
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        // Primary: single combined endpoint
        const res = await api.get("/user/filters");
        if (res.data.success) {
          setCategories(res.data.categories || []);
          setFoodTypes(res.data.foodTypes || []);
          setAllTags(res.data.tags || []);
        }
      } catch {
        // Fallback: individual endpoints
        try {
          const [catRes, ftRes, tagRes] = await Promise.all([
            api.get("/user/categories"),
            api.get("/user/food-types"),
            api.get("/user/tags"),
          ]);
          setCategories(catRes.data.categories || []);
          setFoodTypes(ftRes.data.foodTypes || []);
          setAllTags(tagRes.data.tags || []);
        } catch (e) {
          console.error("Filter load failed:", e);
        }
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  /* ── Core fetch function ── */
  const fetchMeals = useCallback(async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, any> = { page, limit: 12 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedFoodType) params.foodType = selectedFoodType;
      if (selectedTags.length) params.tags = selectedTags.join(",");
      const res = await api.get("/user/meals", { params });
      if (res.data.success) {
        setMeals(res.data.meals || []);
        setPagination({
          page: res.data.page,
          totalPages: res.data.totalPages,
          total: res.data.total,
          limit: res.data.limit,
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load meals");
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedFoodType, selectedTags]);

  /* ── Initial load ── */
  useEffect(() => {
    fetchMeals(1);
  }, []);

  /* ── Filter change → reset to page 1 ── */
  useEffect(() => {
    if (!filtersMounted.current) {
      filtersMounted.current = true;
      return;
    }
    setCurrentPage(1);
    fetchMeals(1);
  }, [selectedCategory, selectedFoodType, selectedTags, fetchMeals]);

  /* ── Debounced search ── */
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchMeals(1);
    }, 500);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search, fetchMeals]);

  /* ── Page navigation ── */
  useEffect(() => {
    fetchMeals(currentPage);
  }, [currentPage]);

  /* ── Helpers ── */
  const toggleTag = (id: string) =>
    setSelectedTags((p) =>
      p.includes(id) ? p.filter((t) => t !== id) : [...p, id]
    );

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedFoodType("");
    setSelectedTags([]);
    setSearch("");
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedFoodType ? 1 : 0) +
    selectedTags.length;

  const filterProps = {
    categories,
    foodTypes,
    allTags,
    selectedCategory,
    setSelectedCategory,
    selectedFoodType,
    setSelectedFoodType,
    selectedTags,
    toggleTag,
    clearFilters,
    loadingFilters,
  };

  /* ─── Render ─────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Our Menu
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Explore our delicious range of homemade meals
          </p>
        </div>

        {/* Search + Mobile Filter Button */}
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 lg:hidden scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === ""
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat._id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-6">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {loading
                  ? "Loading..."
                  : `Showing ${pagination?.total ?? meals.length} items`}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🍽️</p>
                <p className="text-gray-500 font-medium">No meals found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2 bg-orange-500 text-white text-sm rounded-xl font-medium hover:bg-orange-600 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((meal) => (
                  <MealCard key={meal._id} meal={meal} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - currentPage) <= 1
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1)
                      acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`e-${i}`}
                        className="px-1 text-gray-400 text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                          currentPage === p
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="w-72 bg-white h-full overflow-y-auto shadow-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Filters
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <FilterPanel {...filterProps} />
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-4 w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}