"use client"

import { useState } from "react"
import { Search, Plus, SlidersHorizontal, X } from "lucide-react"

const menuItems = [
  {
    id: 1,
    name: "Dal Makhani with Jeera Rice",
    description: "Creamy black lentils slow-cooked with butter and cream, served with aromatic jeera rice.",
    price: 120,
    type: "veg",
    category: "Main Course",
    tags: ["Popular", "High Protein"],
  },{
    id: 2,
    name: "Butter Chicken with Naan",
    description: "Tender chicken in rich tomato-butter gravy with soft butter naan.",
    price: 180,
    type: "non-veg",
    category: "Main Course",
    tags: ["Bestseller", "Chef Special"],
  },
  {
    id: 3,
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in spicy tomato gravy with rice.",
    price: 150,
    type: "veg",
    category: "Main Course",
    tags: ["High Protein", "Spicy"],
  },{
    id: 4,
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fluffy fried bread.",
    price: 110,
    type: "veg",
    category: "Main Course",
    tags: ["Popular", "North Indian"],
  },
  {
    id: 5,
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with spiced chicken and herbs.",
    price: 200,
    type: "non-veg",
    category: "Biryani",
    tags: ["Bestseller", "Chef Special"],
  },
  {
    id: 6,
    name: "Veg Biryani",
    description: "Aromatic rice with mixed vegetables and spices.",
    price: 140,
    type: "veg",
    category: "Biryani",
    tags: ["Popular"],
  },
  {
    id: 7,
    name: "Rajma Chawal",
    description: "Kidney beans curry with steamed rice - comfort food at its best.",
    price: 100,
    type: "veg",
    category: "Main Course",
    tags: ["Comfort Food", "High Protein"],
  },
  {
    id: 8,
    name: "Fish Curry with Rice",
    description: "Fresh fish in tangy coconut curry with steamed rice.",
    price: 180,
    type: "non-veg",
    category: "Main Course",
    tags: ["Coastal Special"],
  },
]

const categories = ["All Items", "Main Course", "Biryani", "Thali", "Breakfast", "Snacks"]
const allTags = ["Popular", "High Protein", "Bestseller", "Chef Special", "Spicy", "North Indian", "Comfort Food", "Coastal Special"]
const tagColors: Record<string, string> = {
  Popular: "bg-blue-50 text-blue-600",
  "High Protein": "bg-purple-50 text-purple-600",
  Bestseller: "bg-yellow-50 text-yellow-600",
  "Chef Special": "bg-pink-50 text-pink-600",
  Spicy: "bg-red-50 text-red-600",
  "North Indian": "bg-orange-50 text-orange-600",
  "Comfort Food": "bg-green-50 text-green-600",
  "Coastal Special": "bg-teal-50 text-teal-600",
};
const placeholderColors: Record<number, string> = {
  1: "from-amber-200 to-yellow-300",
  2: "from-orange-300 to-red-300",
  3: "from-red-200 to-orange-200",
  4: "from-yellow-200 to-amber-300",
  5: "from-yellow-300 to-orange-300",
  6: "from-green-200 to-emerald-300",
  7: "from-red-300 to-rose-300",
  8: "from-teal-200 to-cyan-300",
};
// ─── FILTER PANEL (shared between sidebar & drawer) ─────────────────────────
function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  foodType,
  setFoodType,
  selectedTags,
  toggleTag,
  clearFilters,
}: {
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  foodType: "all" | "veg" | "non-veg"
  setFoodType: (t: "all" | "veg" | "non-veg") => void
  selectedTags: string[]
  toggleTag: (tag: string) => void
  clearFilters: () => void
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="accent-orange-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Food Type */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Food Type</p>
        <div className="space-y-1.5">
          {[
            { value:"all", label: "All" },
            { value:"veg", label: "Vegetarian" },
            { value:"non-veg", label: "Non-Vegetarian" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="foodtype"
                checked={foodType === opt.value}
                onChange={() => setFoodType(opt.value as "all" | "veg" | "non-veg")}
                className="accent-orange-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
        <div className="space-y-1.5">
          {allTags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="accent-orange-500 w-3.5 h-3.5 rounded"
              />
              <span className="text-sm text-gray-600">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Items")
  const [foodType, setFoodType] = useState<"all" | "veg" | "non-veg">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedCategory("All Items")
    setFoodType("all")
    setSelectedTags([])
    setSearch("")
  }

  const filtered = menuItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      selectedCategory === "All Items" || item.category === selectedCategory
    const matchType =
      foodType === "all" ||
      (foodType === "veg" && item.type === "veg") ||
      (foodType === "non-veg" && item.type === "non-veg")
    const matchTags =
      selectedTags.length === 0 || selectedTags.every((t) => item.tags.includes(t))
    return matchSearch && matchCategory && matchType && matchTags
  })

  const activeFilterCount =
    (selectedCategory !== "All Items" ? 1 : 0) +
    (foodType !== "all" ? 1 : 0) +
    selectedTags.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-sm text-gray-400 mt-1">Explore our delicious range of homemade meals</p>
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400 transition-colors"
            />
          </div>
          {/* Filter button: visible only on mobile/tablet */}
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

        {/* Mobile Category Horizontal Scroll (sm only) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 lg:hidden scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-6">
              <FilterPanel
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                foodType={foodType}
                setFoodType={setFoodType}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* ── Grid ── */}
          <main className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 mb-4">Showing {filtered.length} items</p>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No items found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image placeholder */}
                    <div className={`relative h-40 sm:h-36 bg-gradient-to-br ${placeholderColors[item.id]}`}>
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
                          item.type === "veg" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {item.type === "veg" ? "Veg" : "Non-Veg"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors[tag] ?? "bg-gray-100 text-gray-500"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Price + Add */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-orange-500">₹{item.price}</span>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer Overlay ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="w-72 bg-white h-full overflow-y-auto shadow-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              foodType={foodType}
              setFoodType={setFoodType}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              clearFilters={clearFilters}
            />
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
  )
}