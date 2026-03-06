"use client";

import api from ".././lib/axios";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/* ─── Types ─────────────────────────────────── */
interface BulkImage { _id: string; url: string; key: string }
interface BulkOrder {
  _id: string; name: string; description?: string; price: number;
  minQuantity?: number; maxQuantity?: number; category?: string;
  preparationTime?: number; isAvailable?: boolean;
  imageUrl: BulkImage[]; createdAt: string;
}

/* ─── SVG Icons ──────────────────────────────── */
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);

const EVENT_TYPES = ["Corporate Event","Wedding","Birthday Party","College Fest","Office Lunch","Religious Gathering","Other"];
const inp = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white";

/* ─── Image Slider ───────────────────────────── */
function ImageSlider({ images, name }: { images: BulkImage[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % images.length), 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);
  const go = (dir: "prev" | "next") => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent((p) => dir === "prev" ? (p - 1 + images.length) % images.length : (p + 1) % images.length);
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % images.length), 3000);
  };
  if (!images.length) return (
    <div className="h-52 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center rounded-t-2xl">
      <span className="text-5xl">🍽️</span>
    </div>
  );
  return (
    <div className="relative h-52 rounded-t-2xl overflow-hidden group">
      {images.map((img, i) => (
        <img key={img._id} src={img.url} alt={`${name} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? "opacity-100" : "opacity-0"}`} />
      ))}
      {images.length > 1 && (<>
        <button onClick={() => go("prev")} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => go("next")} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-4 h-4" /></button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? "bg-white w-3" : "bg-white/50 w-1.5"}`} />))}
        </div>
        <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">{current + 1}/{images.length}</span>
      </>)}
    </div>
  );
}

/* ─── Quote Dialog ───────────────────────────── */
function QuoteDialog({ order, onClose }: { order: BulkOrder; onClose: () => void }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", company:"", eventType:"", eventDate:"", quantity:"", requirements:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const estimatedTotal = form.quantity && !isNaN(Number(form.quantity)) ? order.price * Number(form.quantity) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/bulk-quotes/submit", {
        bulkOrderId: order._id, name: form.name, email: form.email, phone: form.phone,
        company: form.company, eventType: form.eventType, eventDate: form.eventDate,
        quantity: Number(form.quantity), requirements: form.requirements,
      });
      if (res.data.success) setSubmitted(true);
      else setError(res.data.message || "Submission failed");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Request a Quote</h2>
            <p className="text-xs text-gray-400 mt-0.5">For: <span className="text-orange-500 font-medium">{order.name}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition"><X className="w-5 h-5" /></button>
        </div>

        {/* Order summary strip */}
        <div className="mx-6 mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
          {order.imageUrl?.[0]?.url && (
            <img src={order.imageUrl[0].url} alt={order.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-orange-100" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{order.name}</p>
            <p className="text-xs text-gray-500">
              ₹{order.price.toLocaleString("en-IN")} / unit
              {(order.minQuantity || order.maxQuantity) && <span className="ml-2">· Qty: {order.minQuantity}–{order.maxQuantity}</span>}
            </p>
          </div>
          {order.category && (
            <span className="text-xs bg-white border border-orange-200 text-orange-600 px-2 py-0.5 rounded-full font-medium capitalize">{order.category}</span>
          )}
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quote Submitted!</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              We'll contact you at <span className="font-medium text-gray-700">{form.phone}</span> within 2 hours.
            </p>
            <button onClick={onClose} className="mt-6 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-sm transition">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input required type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company / Organization</label>
                <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Optional" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Event Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select required value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className={inp + " appearance-none"}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-3 top-3 text-gray-400 pointer-events-none"><ChevronDownIcon /></div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Event Date <span className="text-red-500">*</span></label>
                <input required type="date" min={new Date().toISOString().split("T")[0]} value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className={inp} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                  {(order.minQuantity || order.maxQuantity) && (
                    <span className="text-gray-400 font-normal ml-1">(Min: {order.minQuantity ?? 1}{order.maxQuantity ? `, Max: ${order.maxQuantity}` : ""})</span>
                  )}
                </label>
                <input required type="number" min={order.minQuantity ?? 1} max={order.maxQuantity ?? undefined}
                  value={form.quantity} onChange={(e) => set("quantity", e.target.value)}
                  placeholder={`Min. ${order.minQuantity ?? 1}`} className={inp} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Additional Requirements</label>
              <textarea rows={3} value={form.requirements} onChange={(e) => set("requirements", e.target.value)}
                placeholder="Menu preferences, dietary needs, delivery instructions..."
                className={inp + " resize-none"} />
            </div>

            {estimatedTotal !== null && (
              <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                <p className="text-sm text-orange-700 font-medium">
                  💡 Estimated total: <span className="text-orange-600 font-bold text-base">₹{estimatedTotal.toLocaleString("en-IN")}</span>
                  <span className="text-orange-500 text-xs font-normal ml-1">({form.quantity} × ₹{order.price.toLocaleString("en-IN")})</span>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm text-gray-700 transition">Cancel</button>
              <button type="submit" disabled={loading}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm text-white transition ${loading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Bulk Order Card ────────────────────────── */
function BulkOrderCard({ order, onGetQuote }: { order: BulkOrder; onGetQuote: (o: BulkOrder) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <ImageSlider images={order.imageUrl} name={order.name} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{order.name}</h3>
          {order.category && (
            <span className="shrink-0 text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full font-medium capitalize">{order.category}</span>
          )}
        </div>
        {order.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{order.description}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
          {(order.minQuantity || order.maxQuantity) && <span className="flex items-center gap-1"><UsersIcon />{order.minQuantity}–{order.maxQuantity} pcs</span>}
          {order.preparationTime && <span className="flex items-center gap-1"><ClockIcon />{order.preparationTime} mins</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">₹{order.price.toLocaleString("en-IN")}</span>
          <button onClick={() => onGetQuote(order)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition active:scale-95">
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between mt-4"><div className="h-6 bg-gray-100 rounded w-20" /><div className="h-8 bg-gray-100 rounded w-24" /></div>
      </div>
    </div>
  );
}

const PACKAGES = [
  { id:"silver", name:"Silver", price:110, minMeals:20, popular:false, features:["Standard packaging","Basic customization","24hr advance order"] },
  { id:"gold", name:"Gold", price:95, minMeals:50, popular:true, features:["Premium packaging","Menu customization","Dedicated support","Same day delivery"] },
  { id:"premium", name:"Premium", price:85, minMeals:100, popular:false, features:["Luxury packaging","Full menu customization","Priority support","Live tracking","Setup assistance"] },
];

export default function BulkOrdersPage() {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [quoteOrder, setQuoteOrder] = useState<BulkOrder | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingOrders(true);
      try {
        const res = await api.get("/bulk/public");
        if (res.data.success) setBulkOrders(res.data.data || []);
      } catch { setOrdersError("Failed to load bulk orders."); }
      finally { setLoadingOrders(false); }
    })();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-b from-orange-50 to-gray-50 py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Bulk Orders for Events &amp; Parties</h1>
        <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base md:text-lg">Perfect for corporate events, weddings, parties, and gatherings.</p>
        <button onClick={() => document.getElementById("bulk-packs")?.scrollIntoView({ behavior:"smooth" })}
          className="mt-6 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition">Browse Packs</button>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[{icon:<UsersIcon/>,title:"Any Quantity",desc:"From 20 to 1000+ guests"},{icon:<ClockIcon/>,title:"On-Time Delivery",desc:"Guaranteed timely service"},{icon:<ShieldIcon/>,title:"Quality Assured",desc:"Fresh & hygienic meals"}].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">{f.icon}</div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BULK PACKS */}
      <section id="bulk-packs" className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Available Bulk Packs</h2>
            <p className="text-gray-400 text-sm mt-2">Click "Get Quote" on any pack to place a request</p>
          </div>
          {ordersError ? (
            <div className="text-center py-12 text-red-500 text-sm">{ordersError}</div>
          ) : loadingOrders ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_,i)=><SkeletonCard key={i}/>)}</div>
          ) : bulkOrders.length === 0 ? (
            <div className="text-center py-16"><p className="text-4xl mb-3">📦</p><p className="text-gray-500 font-medium">No bulk packs available right now.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bulkOrders.map((order) => <BulkOrderCard key={order._id} order={order} onGetQuote={setQuoteOrder} />)}
            </div>
          )}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Choose Your Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`relative rounded-2xl border-2 p-6 bg-white ${pkg.popular?"border-orange-500 shadow-lg":"border-gray-100 shadow hover:border-orange-300"}`}>
                {pkg.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Most Popular</span></div>}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{pkg.name}</h3>
                <div className="text-center mb-1"><span className="text-3xl font-bold text-orange-500">₹{pkg.price}</span><span className="text-gray-500 text-sm">/meal</span></div>
                <p className="text-center text-gray-400 text-sm mb-5">Min. {pkg.minMeals} meals</p>
                <ul className="space-y-2 mb-6">{pkg.features.map((f)=>(<li key={f} className="flex items-center gap-2 text-sm text-gray-600"><CheckIcon/>{f}</li>))}</ul>
                <button onClick={() => document.getElementById("bulk-packs")?.scrollIntoView({behavior:"smooth"})}
                  className={`w-full py-2.5 rounded-lg font-medium transition ${pkg.popular?"bg-orange-500 text-white hover:bg-orange-600":"border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  Browse Packs
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">All packages include free delivery, GST invoice, and dedicated account manager.</p>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{value:"500+",label:"Events Catered"},{value:"50,000+",label:"Meals Delivered"},{value:"4.9★",label:"Average Rating"},{value:"2 hrs",label:"Response Time"}].map((s)=>(
            <div key={s.label}><div className="text-2xl font-bold text-orange-500">{s.value}</div><div className="text-gray-500 text-sm mt-1">{s.label}</div></div>
          ))}
        </div>
      </section>

      {/* QUOTE DIALOG */}
      {quoteOrder && <QuoteDialog order={quoteOrder} onClose={() => setQuoteOrder(null)} />}
    </main>
  );
}