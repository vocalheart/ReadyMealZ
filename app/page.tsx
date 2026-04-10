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
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
// Used INSIDE the hero grid on desktop (right column)
// Used as full-width banner on mobile (above hero text)
function HeroSlider({ variant = "hero" }: { variant?: "hero" | "banner" }) {
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
      goTo(diff > 0 ? current + 1 : current - 1);
      resetTimer();
    }
  };

  if (ads.length === 0) return null;

  const ad = ads[current];

  // ── BANNER variant: full-width strip at top (mobile only via parent show/hide) ──
  if (variant === "banner") {
    return (
      <div className="w-full bg-black select-none">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "16/7" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {ads.map((item, i) => (
            <div
              key={item._id}
              className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          ))}

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-3">
            <p className="text-white text-sm font-semibold tracking-wide drop-shadow-md line-clamp-1">
              {ad.title}
            </p>
          </div>

          {/* Slide counter */}
          {ads.length > 1 && (
            <div className="absolute top-2 right-3 z-20 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {current + 1} / {ads.length}
            </div>
          )}
        </div>

        {/* Dots */}
        {ads.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 py-2 bg-black">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetTimer(); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "bg-orange-500 w-5 h-1.5" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── HERO variant: card-style slider for right column on desktop ──
  return (
    <div className="w-full h-full select-none">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ aspectRatio: "4/3" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {ads.map((item, i) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent rounded-2xl" />
          </div>
        ))}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4">
          <p className="text-white text-sm sm:text-base font-semibold tracking-wide drop-shadow-md line-clamp-1">
            {ad.title}
          </p>
        </div>

        {/* Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={() => { goTo(current - 1); resetTimer(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { goTo(current + 1); resetTimer(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slide counter */}
        {ads.length > 1 && (
          <div className="absolute top-3 right-3 z-20 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {current + 1} / {ads.length}
          </div>
        )}
      </div>

      {/* Dots */}
      {ads.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "bg-orange-500 w-5 h-1.5" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-[#FFF8F0]">

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-orange-500 text-white text-center py-2 px-4 text-xs font-medium">
        🍱 <strong>New:</strong> Explore all platform features and screens –{" "}
        <a href="#" className="underline font-semibold">View Feature Tour</a>
      </div>

      {/* ── MOBILE: Full-width banner slider (hidden on md+) ── */}
      <div className="block md:hidden">
        <HeroSlider variant="banner" />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">

        {/* LEFT: Text content */}
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
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
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

        {/* RIGHT: Slider — only visible on md+ */}
        <div className="order-1 md:order-2 hidden md:block">
          <HeroSlider variant="hero" />
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