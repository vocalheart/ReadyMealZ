"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

// ── SVG Icons ──
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1m8-11h3l3 4v5h-6V5z" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.08L5.6 20l1-2c.5.5 1 1 1.5 1.5C11 22 17 21 19 14c2-7-2-11-2-11s-1 3-5 4c0 0 3 0 5 5z" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

// ── Category Icons ──
const AllItemsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);
const MainCourseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h18M12 3v1m0 16v1M4.22 4.22l.707.707m13.86 13.86l.707.707M1 13H3m18 0h2M4.22 21.78l.707-.707M19.07 4.93l.707-.707" />
    <circle cx="12" cy="13" r="5" />
  </svg>
);
const BiryaniIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8c0-3.87 3.13-7 7-7s7 3.13 7 7H5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M5 8c0 2 1.5 4 7 4s7-2 7-4M8 20h8M12 12v8" />
  </svg>
);
const ThaliIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
    <circle cx="7" cy="8" r="1.5" /><circle cx="17" cy="8" r="1.5" /><circle cx="17" cy="16" r="1.5" />
  </svg>
);
const BreakfastIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
  </svg>
);
const SnacksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v1a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM6 12v5a2 2 0 002 2h8a2 2 0 002-2v-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

// ── Types ──
interface Ad {
  _id: string;
  title: string;
  image: string;
  isActive: boolean;
  priority: number;
}

// ── Hero Slider Component ──
function HeroSlider() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("https://readymealzbackend.onrender.com/api/admin/ads/public/active")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          const sorted = [...json.data].sort((a: Ad, b: Ad) => a.priority - b.priority);
          setAds(sorted);
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + ads.length) % ads.length);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [ads.length, isAnimating]
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (ads.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % ads.length);
      }, 4000);
    }
  }, [ads.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
      resetTimer();
    }
  };

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <section className="w-full bg-black select-none">
      {/* Slider track */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/6" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render all slides, show active */}
        {ads.map((item, i) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          </div>
        ))}

        {/* Title overlay — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-8 pb-4 sm:pb-6">
          <p className="text-white text-sm sm:text-base md:text-lg font-semibold tracking-wide drop-shadow-md line-clamp-1">
            {ad.title}
          </p>
        </div>

        {/* Arrows — desktop only */}
        {ads.length > 1 && (
          <>
            <button
              onClick={() => { goTo(current - 1); resetTimer(); }}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white items-center justify-center transition-all hover:scale-110"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { goTo(current + 1); resetTimer(); }}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white items-center justify-center transition-all hover:scale-110"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slide counter badge — top right */}
        {ads.length > 1 && (
          <div className="absolute top-3 right-4 z-20 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {current + 1} / {ads.length}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {ads.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 py-2.5 bg-black">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-orange-500 w-5 h-1.5"
                  : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Data ──
const lunchItems = [
  { name: "Dal Makhani with Jeera Rice", desc: "Creamy black lentils slow-cooked with butter and cream, served with aromatic jeera rice.", price: "₹120", tag: "Veg", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
  { name: "Butter Chicken with Naan", desc: "Tender chicken in rich tomato-butter gravy with soft butter naan.", price: "₹180", tag: "Non-Veg", img: "https://images.unsplash.com/photo-1604908176997-4318c6e3f4f6?w=400&q=80" },
  { name: "Paneer Tikka Masala", desc: "Grilled cottage cheese cubes in spicy tomato gravy with rice.", price: "₹150", tag: "Veg", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { name: "Chole Bhature", desc: "Spicy chickpea curry with fluffy fried bread.", price: "₹110", tag: "Veg", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
];
const dinnerItems = [
  { name: "Shahi Paneer with Roti", desc: "Rich and creamy paneer curry in mughlai style gravy, served with soft rotis.", price: "₹140", tag: "Veg", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { name: "Chicken Biryani", desc: "Fragrant basmati rice layered with spiced chicken, slow-cooked to perfection.", price: "₹200", tag: "Non-Veg", img: "https://images.unsplash.com/photo-1604908176997-4318c6e3f4f6?w=400&q=80" },
  { name: "Mix Veg Thali", desc: "Wholesome thali with seasonal vegetables, dal, roti, rice and dessert.", price: "₹130", tag: "Veg", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
  { name: "Egg Curry with Rice", desc: "Spiced egg curry in tangy onion-tomato gravy served with steamed rice.", price: "₹120", tag: "Non-Veg", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"lunch" | "dinner">("lunch");
  const [activeCategory, setActiveCategory] = useState("Main Course");
  const menuItems = activeTab === "lunch" ? lunchItems : dinnerItems;

  const categories = [
    { label: "All Items", icon: <AllItemsIcon /> },
    { label: "Main Course", icon: <MainCourseIcon /> },
    { label: "Biryani", icon: <BiryaniIcon /> },
    { label: "Thali", icon: <ThaliIcon /> },
    { label: "Breakfast", icon: <BreakfastIcon /> },
    { label: "Snacks", icon: <SnacksIcon /> },
  ];

  const plans = [
    { price: "₹99", days: "3 Days Plan", meals: 3, total: "₹297", savings: null, popular: false },
    { price: "₹89", days: "7 Days Plan", meals: 7, total: "₹623", savings: "Save ₹70", popular: true },
    { price: "₹79", days: "15 Days Plan", meals: 15, total: "₹1185", savings: "Save ₹300", popular: false },
    { price: "₹69", days: "30 Days Plan", meals: 30, total: "₹2070", savings: "Save ₹900", popular: false },
  ];

  return (
    <main className="bg-[#FFF8F0]">

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-orange-500 text-white text-center py-2 px-4 text-xs font-medium">
        🍱 <strong>New:</strong> Explore all platform features and screens –{" "}
        <a href="#" className="underline font-semibold">View Feature Tour</a>
      </div>

      {/* ── HERO SLIDER ── */}
      <HeroSlider />

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 md:order-1">
          <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🌿 Serving Fresh in Bhopal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            Homemade Meals,<br />Delivered Daily
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
            Subscribe to healthy, delicious tiffin service. Fresh meals made with love, delivered right to your door.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/subscribe" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base">
              Start Tiffin Subscription <ArrowRightIcon />
            </Link>
            <Link href="/menu" className="border border-gray-300 bg-white px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700 text-sm sm:text-base text-center">
              View Meals
            </Link>
            <Link href="/bulk-order" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base">
              Bulk-Order <ArrowRightIcon />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:flex sm:gap-8">
            {[
              { icon: <ClockIcon />, label: "On Time", sub: "Delivery" },
              { icon: <ShieldIcon />, label: "100%", sub: "Hygienic" },
              { icon: <TruckIcon />, label: "Free", sub: "Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow flex items-center justify-center text-orange-500 flex-shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="font-semibold text-xs sm:text-sm">{stat.label}</div>
                  <div className="text-gray-500 text-xs">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
       
      </section>

      {/* ── TODAY'S MENU ── */}
      <section className="bg-gray-50 py-12 sm:py-16">
       
          <div className="text-center mt-8">
            <Link href="/menu" className="border border-gray-300 px-6 py-2.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition inline-flex items-center gap-2">
              View Full Menu <ArrowRightIcon />
            </Link>
          </div>
      </section>
     
      {/* ── BULK ORDERS CTA ── */}
      <section className="bg-orange-500 py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Bulk Orders for Events &amp; Parties</h2>
          <p className="mt-3 text-orange-100 text-sm sm:text-base">Planning an event? Get special pricing for bulk orders starting from 20 meals</p>
          <a href="#" className="inline-flex items-center gap-2 mt-6 bg-white text-gray-800 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition">
            Request Quote <ArrowRightIcon />
          </a>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Simple process designed for busy lifestyles</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 mt-10">
            {[
              { title: "Choose Your Plan", desc: "Pick a subscription plan that suits your schedule and appetite." },
              { title: "We Cook Fresh", desc: "Our home chefs prepare your meals fresh every morning with quality ingredients." },
              { title: "Delivered To You", desc: "Hot tiffin delivered right to your doorstep, on time, every day." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 text-white flex items-center justify-center rounded-full text-lg sm:text-xl font-bold shadow-lg">{i + 1}</div>
                <h3 className="mt-4 sm:mt-5 font-bold text-base sm:text-lg text-gray-900">{step.title}</h3>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}