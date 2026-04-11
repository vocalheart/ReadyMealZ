"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  X,
  Navigation,
  MapPin,
  Locate,
  CheckCircle2,
  Loader2,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number } | null;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

/* ─── Inner map (loaded only client-side, never SSR) ─────────── */
const InnerMap = dynamic(() => import("./InnerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100" style={{ minHeight: 320 }}>
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="w-7 h-7 animate-spin text-orange-400" />
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  ),
});

/* ─── Main Component ─────────────────────────────────────────── */
export default function MapPicker({
  onLocationSelect,
  onClose,
  initialLocation,
}: MapPickerProps) {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [initCenter, setInitCenter] = useState<[number, number]>([23.2599, 77.4126]);
  const [locating, setLocating] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const [shortLabel, setShortLabel] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [mapKey, setMapKey] = useState(0); // force remount when needed

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  /* ── Init ── */
  useEffect(() => {
    if (initialLocation) {
      const p: [number, number] = [initialLocation.lat, initialLocation.lng];
      setInitCenter(p);
      setMarkerPos(p);
      fetchLabel(p[0], p[1]);
    } else {
      navigator.geolocation?.getCurrentPosition(
        (pos) => setInitCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  /* ── Close search on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Geocode ── */
  const fetchLabel = async (lat: number, lng: number) => {
    setGeocoding(true);
    setLocationLabel("");
    setShortLabel("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const parts: string[] = data.display_name?.split(",") ?? [];
      setLocationLabel(parts.slice(0, 4).join(", "));
      setShortLabel(parts.slice(0, 2).join(", "));
    } catch {
      setLocationLabel("Location selected");
      setShortLabel("Selected");
    } finally {
      setGeocoding(false);
    }
  };

  const handleMarkerSet = useCallback(
    (lat: number, lng: number) => {
      setConfirmed(false);
      setMarkerPos([lat, lng]);
      onLocationSelect(lat, lng);
      fetchLabel(lat, lng);
    },
    [onLocationSelect]
  );

  /* ── Current Location ── */
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setFlyTarget(p);
        setLocating(false);
        handleMarkerSet(p[0], p[1]);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ── Search ── */
  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    clearTimeout(searchTimer.current);
    if (val.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=in`
        );
        const data: SearchResult[] = await res.json();
        setSearchResults(data);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const handleSearchSelect = (result: SearchResult) => {
    const p: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    setFlyTarget(p);
    setSearchQuery(result.display_name.split(",").slice(0, 2).join(", "));
    setShowResults(false);
    handleMarkerSet(p[0], p[1]);
  };

  /* ── Confirm ── */
  const handleConfirm = () => {
    if (!markerPos || geocoding) return;
    setConfirmed(true);
    setTimeout(onClose, 500);
  };

  /* ── Reset ── */
  const handleReset = () => {
    setMarkerPos(null);
    setLocationLabel("");
    setShortLabel("");
    setSearchQuery("");
    setConfirmed(false);
    setFlyTarget(null);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-3">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          maxHeight: "92vh",
          animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── Header ── */}
        <div className="px-5 py-3.5 border-b flex items-center gap-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm shadow-orange-200">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
              Pin Your Delivery Location
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {shortLabel || "Search, tap or drag to adjust pin"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {markerPos && (
              <button
                onClick={handleReset}
                title="Reset pin"
                className="p-2 hover:bg-orange-100 rounded-xl transition-colors text-gray-400 hover:text-orange-500"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="px-4 py-3 border-b bg-white shrink-0" ref={searchRef}>
          <div className="relative">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-orange-400 focus-within:bg-white transition-all">
              {searching ? (
                <Loader2 className="w-4 h-4 text-orange-400 shrink-0 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search area, landmark, colony…"
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowResults(false);
                    setSearchResults([]);
                  }}
                  className="text-gray-300 hover:text-gray-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-2xl border border-gray-200 shadow-xl z-10 overflow-hidden">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearchSelect(r)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 line-clamp-2 leading-snug">
                      {r.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Map (dynamic, no SSR) ── */}
        <div className="relative flex-1" style={{ minHeight: 320, height: 360 }}>
          <InnerMap
            key={mapKey}
            initCenter={initCenter}
            markerPos={markerPos}
            flyTarget={flyTarget}
            onMarkerSet={handleMarkerSet}
            onCurrentLocFound={(p) => setFlyTarget(p)}
          />

          {/* Use My Location FAB */}
          <button
            onClick={handleCurrentLocation}
            disabled={locating}
            className="absolute bottom-4 right-4 z-[400] bg-white shadow-lg border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all disabled:opacity-60 active:scale-95"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <Locate className="w-4 h-4 text-orange-500" />
            )}
            <span className="text-xs">{locating ? "Locating…" : "My Location"}</span>
          </button>

          {/* Hints */}
          {markerPos && !geocoding && (
            <div className="absolute bottom-4 left-4 z-[400] bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
              <Navigation className="w-3 h-3" />
              Drag pin to adjust
            </div>
          )}
          {!markerPos && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-sm text-gray-600 text-xs px-4 py-2 rounded-full shadow flex items-center gap-2 border border-gray-100 whitespace-nowrap pointer-events-none">
              <Navigation className="w-3.5 h-3.5 text-orange-500" />
              Tap on the map to drop a pin
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-4 bg-gray-50 border-t shrink-0 space-y-3">
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-2xl border transition-all ${
              locationLabel ? "bg-white border-orange-200" : "bg-white border-gray-200"
            }`}
          >
            {geocoding ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm w-full">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Finding address details…</span>
              </div>
            ) : locationLabel ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-orange-500 mb-0.5">Selected Address</p>
                  <p className="text-sm text-gray-700 leading-snug line-clamp-2">{locationLabel}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>No location selected yet</span>
              </div>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!markerPos || geocoding}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              confirmed
                ? "bg-green-500 text-white shadow-md shadow-green-200"
                : markerPos && !geocoding
                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-200"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {confirmed ? (
              <><CheckCircle2 className="w-5 h-5" /> Location Confirmed!</>
            ) : geocoding ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying location…</>
            ) : (
              <><MapPin className="w-4 h-4" /> Confirm This Location</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}