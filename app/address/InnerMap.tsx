"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

interface InnerMapProps {
  initCenter: [number, number];
  markerPos: [number, number] | null;
  flyTarget: [number, number] | null;
  onMarkerSet: (lat: number, lng: number) => void;
}

function injectLeafletCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById("leaflet-css")) return;
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.crossOrigin = "";
  document.head.appendChild(link);
}

export default function InnerMap({
  initCenter,
  markerPos,
  flyTarget,
  onMarkerSet,
}: InnerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const orangeIconRef = useRef<any>(null);
  const didInit = useRef(false);
  const [ready, setReady] = useState(false);

  const placeMarker = (lat: number, lng: number) => {
    if (!mapRef.current || !LRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const m = LRef.current
        .marker([lat, lng], { icon: orangeIconRef.current, draggable: true })
        .addTo(mapRef.current);
      m.on("dragend", (e: any) => {
        const ll = e.target.getLatLng();
        onMarkerSet(ll.lat, ll.lng);
      });
      markerRef.current = m;
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    if (!containerRef.current) return;
    didInit.current = true;

    injectLeafletCSS();

    const setup = async () => {
      const L = (await import("leaflet")).default;
      LRef.current = L;

      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      orangeIconRef.current = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [28, 45],
        iconAnchor: [14, 45],
        shadowSize: [45, 45],
      });

      if (!containerRef.current) return;

      const el = containerRef.current as any;
      if (el._leaflet_id) el._leaflet_id = undefined;

      const map = L.map(containerRef.current, {
        center: initCenter,
        zoom: 14,
        zoomControl: false,
        preferCanvas: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "",
      }).addTo(map);

      map.on("click", (e: any) => {
        placeMarker(e.latlng.lat, e.latlng.lng);
        onMarkerSet(e.latlng.lat, e.latlng.lng);
      });

      if (markerPos) placeMarker(markerPos[0], markerPos[1]);

      requestAnimationFrame(() => {
        setTimeout(() => {
          map.invalidateSize({ animate: false });
          setReady(true);
        }, 200);
      });
    };

    setup();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        LRef.current = null;
        didInit.current = false;
        setReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (markerPos) {
      placeMarker(markerPos[0], markerPos[1]);
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerPos, ready]);

  useEffect(() => {
    if (!ready || !flyTarget || !mapRef.current) return;
    mapRef.current.flyTo(flyTarget, 16, { duration: 1.2, easeLinearity: 0.25 });
  }, [flyTarget, ready]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 320 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 320 }} />

      <div
        style={{ position: "absolute", top: 12, right: 12, zIndex: 1000 }}
        className="flex flex-col gap-1.5"
      >
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-9 h-9 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-9 h-9 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {!ready && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 900 }}
          className="flex items-center justify-center bg-gray-100"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-[3px] border-orange-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading map…</span>
          </div>
        </div>
      )}
    </div>
  );
}