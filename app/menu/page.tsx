"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  MapPin, Navigation, Loader2, AlertTriangle, RefreshCw,
  Building2, Clock, CheckCircle2,
} from "lucide-react";
import api from "../lib/axios";
import { MealCard } from "../components/MealCard";

/* ─── Types ─────────────────────────────────── */
interface Category  { _id: string; name: string; slug?: string; mealCount?: number; }
interface FoodType  { _id: string; name: string; }
interface Tag       { _id: string; name: string; }
interface MealImage { url: string; key: string; }
interface Meal {
  _id: string; name: string; slug?: string; description: string;
  price: number; discountPercentage?: number; discountPrice?: number;
  category?: Category; foodType?: FoodType; tags?: Tag[];
  images: MealImage[]; isAvailable: boolean; isFeatured: boolean;
  averageRating?: number; totalReviews?: number;
  preparationTime?: number; calories?: number;
}
interface Branch {
  _id: string; name: string; branchCode?: string;
  address?: string; city?: string;
  deliveryRadiusKm?: number; minimumOrderAmount?: number;
  freeDeliveryAbove?: number;
  estimatedDeliveryTime?: { min: number; max: number };
  distanceKm?: number;
}
interface Pagination { page: number; totalPages: number; total: number; limit: number; }
type LocationState = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "cached";

const LOCATION_KEY = "userLocation";
const LOCATION_TTL = 10 * 60 * 1000; // 10 min cache

/* ─── Skeleton Card ──────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-32 sm:h-40 bg-gray-100" />
      <div className="p-2.5 sm:p-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="flex justify-between mt-3">
          <div className="h-5 bg-gray-100 rounded w-14" />
          <div className="h-7 bg-gray-100 rounded w-14" />
        </div>
      </div>
    </div>
  );
}

/* ─── Location Banner ────────────────────────── */
function LocationBanner({
  state, branch, onRetry, onManual,
}: {
  state: LocationState;
  branch: Branch | null;
  onRetry: () => void;
  onManual: () => void;
}) {
  if (state === "requesting") {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 mb-4">
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-500" />
        <span>Detecting your location to find the nearest branch…</span>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-800">Location access denied</p>
          <p className="text-xs text-amber-700 mt-0.5">Enable location in your browser settings or enter your area manually.</p>
        </div>
        <button
          onClick={onManual}
          className="shrink-0 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition"
        >
          Enter area
        </button>
      </div>
    );
  }

  if (state === "unavailable") {
    return (
      <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4">
        <MapPin className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-red-800">We're not available in your area yet</p>
          <p className="text-xs text-red-600 mt-0.5">We're expanding soon! Try a different location.</p>
        </div>
        <button onClick={onRetry} className="shrink-0 p-1.5 text-red-400 hover:text-red-600 transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if ((state === "granted" || state === "cached") && branch) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-green-800 truncate">{branch.name}</p>
            {state === "cached" && (
              <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">cached</span>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
            {branch.distanceKm != null && (
              <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                <Navigation className="w-2.5 h-2.5" />{branch.distanceKm} km away
              </span>
            )}
            {branch.estimatedDeliveryTime && (
              <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {branch.estimatedDeliveryTime.min}–{branch.estimatedDeliveryTime.max} min delivery
              </span>
            )}
            {branch.freeDeliveryAbove != null && (
              <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Free delivery above ₹{branch.freeDeliveryAbove}
              </span>
            )}
          </div>
        </div>
        <button onClick={onRetry} className="shrink-0 p-1.5 text-green-400 hover:text-green-600 transition" title="Refresh location">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
}

/* ─── Manual Location Modal ──────────────────── */
function ManualLocationModal({
  open, onClose, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (pincode: string) => void;
}) {
  const [value, setValue] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Enter your area</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Enter your pincode to find the nearest branch.</p>
        <div className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. 400001"
            value={value}
            onChange={e => setValue(e.target.value.replace(/\D/g, ""))}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
          />
          <button
            onClick={() => { if (value.length >= 4) { onSubmit(value); onClose(); } }}
            disabled={value.length < 4}
            className="px-4 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition"
          >
            Find
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Panel ───────────────────────────── */
function FilterPanel({
  categories, foodTypes, allTags,
  selectedCategory, setSelectedCategory,
  selectedFoodType, setSelectedFoodType,
  selectedTags, toggleTag, clearFilters, loadingFilters,
}: {
  categories: Category[]; foodTypes: FoodType[]; allTags: Tag[];
  selectedCategory: string; setSelectedCategory: (c: string) => void;
  selectedFoodType: string; setSelectedFoodType: (f: string) => void;
  selectedTags: string[]; toggleTag: (id: string) => void;
  clearFilters: () => void; loadingFilters: boolean;
}) {
  if (loadingFilters) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded w-3/4" />)}
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" checked={selectedCategory === ""} onChange={() => setSelectedCategory("")} className="accent-orange-500 w-3.5 h-3.5" />
            <span className="text-sm text-gray-600">All Items</span>
          </label>
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="category" checked={selectedCategory === cat._id} onChange={() => setSelectedCategory(cat._id)} className="accent-orange-500 w-3.5 h-3.5" />
              <span className="text-sm text-gray-600">{cat.name}</span>
              {cat.mealCount !== undefined && <span className="ml-auto text-xs text-gray-400">{cat.mealCount}</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Food Type */}
      {foodTypes.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Food Type</p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="foodtype" checked={selectedFoodType === ""} onChange={() => setSelectedFoodType("")} className="accent-orange-500 w-3.5 h-3.5" />
              <span className="text-sm text-gray-600">All</span>
            </label>
            {foodTypes.map(ft => (
              <label key={ft._id} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="foodtype" checked={selectedFoodType === ft._id} onChange={() => setSelectedFoodType(ft._id)} className="accent-orange-500 w-3.5 h-3.5" />
                <span className="text-sm text-gray-600">{ft.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
          <div className="space-y-1.5">
            {allTags.map(tag => (
              <label key={tag._id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedTags.includes(tag._id)} onChange={() => toggleTag(tag._id)} className="accent-orange-500 w-3.5 h-3.5 rounded" />
                <span className="text-sm text-gray-600">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button onClick={clearFilters} className="w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
        Clear All Filters
      </button>
    </div>
  );
}

/* ─── Main Menu Page ──────────────────────────── */
export default function MenuPage() {
  const [meals, setMeals]             = useState<Meal[]>([]);
  const [pagination, setPagination]   = useState<Pagination | null>(null);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [foodTypes, setFoodTypes]     = useState<FoodType[]>([]);
  const [allTags, setAllTags]         = useState<Tag[]>([]);
  const [branch, setBranch]           = useState<Branch | null>(null);

  const [search, setSearch]               = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [selectedTags, setSelectedTags]   = useState<string[]>([]);
  const [currentPage, setCurrentPage]     = useState(1);

  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [manualOpen, setManualOpen]       = useState(false);
  const [loading, setLoading]             = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError]                 = useState("");

  // location state
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coords, setCoords]               = useState<{ lat: number; lng: number } | null>(null);

  const searchTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersMounted = useRef(false);

  /* ── 1. On mount — check cache or request ── */
  useEffect(() => {
    const cached = localStorage.getItem(LOCATION_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { lat: number; lng: number; ts: number };
        if (Date.now() - parsed.ts < LOCATION_TTL) {
          setCoords({ lat: parsed.lat, lng: parsed.lng });
          setLocationState("cached");
          return;
        }
      } catch { /* bad cache */ }
    }
    requestLocation();
  }, []);

  /* ── 2. Request geolocation ── */
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        localStorage.setItem(LOCATION_KEY, JSON.stringify({ lat, lng, ts: Date.now() }));
        setCoords({ lat, lng });
        setLocationState("granted");
      },
      () => {
        setLocationState("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  /* ── 3. Manual pincode submit ── */
  const handleManualLocation = async (pincode: string) => {
    try {
      // Geocode pincode to lat/lng via backend or fallback
      const res = await api.get(`/user/geocode?pincode=${pincode}`).catch(() => null);
      if (res?.data?.lat && res?.data?.lng) {
        const { lat, lng } = res.data;
        localStorage.setItem(LOCATION_KEY, JSON.stringify({ lat, lng, ts: Date.now() }));
        setCoords({ lat, lng });
        setLocationState("granted");
      } else {
        // fallback: just reload with no coords and show all meals
        setLocationState("denied");
        fetchMeals(1, null);
      }
    } catch {
      setLocationState("denied");
    }
  };

  /* ── 4. Clear location cache and re-request ── */
  const handleRetryLocation = () => {
    localStorage.removeItem(LOCATION_KEY);
    setBranch(null);
    setCoords(null);
    requestLocation();
  };

  /* ── 5. Load filters ── */
  useEffect(() => {
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const res = await api.get("/user/filters");
        if (res.data.success) {
          setCategories(res.data.categories || []);
          setFoodTypes(res.data.foodTypes || []);
          setAllTags(res.data.tags || []);
        }
      } catch {
        try {
          const [catRes, ftRes, tagRes] = await Promise.all([
            api.get("/user/categories"),
            api.get("/user/food-types"),
            api.get("/user/tags"),
          ]);
          setCategories(catRes.data.categories || []);
          setFoodTypes(ftRes.data.foodTypes || []);
          setAllTags(tagRes.data.tags || []);
        } catch (e) { console.error("Filter load failed:", e); }
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  /* ── 6. Fetch meals — called with current coords ── */
  const fetchMeals = useCallback(async (
    page: number,
    loc: { lat: number; lng: number } | null = coords,
  ) => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, any> = { page, limit: 12 };
      if (search.trim())     params.search    = search.trim();
      if (selectedCategory)  params.category  = selectedCategory;
      if (selectedFoodType)  params.foodType  = selectedFoodType;
      if (selectedTags.length) params.tags    = selectedTags.join(",");
      if (loc) { params.lat = loc.lat; params.lng = loc.lng; }

      const res = await api.get("/user/meals", { params });
      if (res.data.success) {
        setMeals(res.data.meals || []);
        setPagination({
          page: res.data.page,
          totalPages: res.data.totalPages,
          total: res.data.total,
          limit: res.data.limit,
        });
        // backend returns nearest branch when lat/lng provided
        if (res.data.branch) {
          setBranch(res.data.branch);
          if (locationState === "requesting") setLocationState("granted");
        } else if (loc && !res.data.branch) {
          // coords given but no branch found — out of delivery area
          setLocationState("unavailable");
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load meals";
      // backend returns 404 / specific message when no branch covers the area
      if (err?.response?.status === 404 || msg.toLowerCase().includes("not available")) {
        setLocationState("unavailable");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, selectedFoodType, selectedTags, coords]);

  // Fetch when coords become available
  useEffect(() => {
    if (locationState === "granted" || locationState === "cached") {
      fetchMeals(1, coords);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState, coords]);

  // Re-fetch when filters change
  useEffect(() => {
    if (!filtersMounted.current) { filtersMounted.current = true; return; }
    setCurrentPage(1);
    fetchMeals(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedFoodType, selectedTags]);

  // Debounce search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setCurrentPage(1); fetchMeals(1); }, 500);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Page change
  useEffect(() => { fetchMeals(currentPage); }, [currentPage]); // eslint-disable-line

  /* ── Denied → still fetch all meals (no location) ── */
  useEffect(() => {
    if (locationState === "denied") fetchMeals(1, null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState]);

  const toggleTag = (id: string) =>
    setSelectedTags(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedFoodType("");
    setSelectedTags([]);
    setSearch("");
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + (selectedFoodType ? 1 : 0) + selectedTags.length;

  const filterProps = {
    categories, foodTypes, allTags,
    selectedCategory, setSelectedCategory,
    selectedFoodType, setSelectedFoodType,
    selectedTags, toggleTag, clearFilters, loadingFilters,
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">

        {/* Header */}
        <div className="mb-3">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Our Meals Menu</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Explore our delicious range of homemade meals</p>
        </div>

        {/* Location Banner */}
        <LocationBanner
          state={locationState}
          branch={branch}
          onRetry={handleRetryLocation}
          onManual={() => setManualOpen(true)}
        />

        {/* Search + Filter */}
        <div className="flex gap-2 mb-3 sm:mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location button */}
          <button
            onClick={locationState === "requesting" ? undefined : requestLocation}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm border transition-colors ${
              locationState === "requesting"
                ? "bg-blue-50 border-blue-200 text-blue-500 cursor-wait"
                : locationState === "granted" || locationState === "cached"
                ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            title="Use my location"
          >
            {locationState === "requesting"
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Navigation className="w-4 h-4" />
            }
          </button>

          {/* Filters drawer toggle */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === "" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat._id ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-6">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm text-gray-400">
                {loading
                  ? "Loading..."
                  : locationState === "unavailable"
                  ? "No meals available in your area"
                  : `Showing ${pagination?.total ?? meals.length} items`
                }
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            {/* Unavailable in area */}
            {locationState === "unavailable" && !loading && (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📍</p>
                <p className="text-gray-700 font-semibold text-base">Not available in your area yet</p>
                <p className="text-gray-400 text-sm mt-1 mb-5">We're expanding fast. Try a nearby pincode.</p>
                <button
                  onClick={() => setManualOpen(true)}
                  className="px-5 py-2.5 bg-orange-500 text-white text-sm rounded-xl font-medium hover:bg-orange-600 transition"
                >
                  Try another area
                </button>
              </div>
            )}

            {/* Requesting — show skeletons */}
            {(loading || locationState === "requesting") && locationState !== "unavailable" && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty */}
            {!loading && locationState !== "requesting" && locationState !== "unavailable" && meals.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🍽️</p>
                <p className="text-gray-500 font-medium">No meals found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-orange-500 text-white text-sm rounded-xl font-medium hover:bg-orange-600 transition">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Meals grid */}
            {!loading && locationState !== "requesting" && locationState !== "unavailable" && meals.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {meals.filter(m => m?._id).map(meal => (
                  <MealCard key={meal._id} meal={meal} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`e-${i}`} className="px-1 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-medium transition ${
                          currentPage === p ? "bg-orange-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
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
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-72 bg-white h-full overflow-y-auto shadow-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <FilterPanel {...filterProps} />
            </div>
            <button onClick={() => setDrawerOpen(false)} className="mt-4 w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Manual Location Modal */}
      <ManualLocationModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        onSubmit={handleManualLocation}
      />
    </div>
  );
}