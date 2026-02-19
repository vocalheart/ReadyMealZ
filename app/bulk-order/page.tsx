"use client";

import { useState } from "react";

// --- SVG Icons ---
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- Packages Data ---
const packages = [
  {
    id: "silver",
    name: "Silver",
    price: 110,
    minMeals: 20,
    popular: false,
    features: ["Standard packaging", "Basic customization", "24hr advance order"],
  },
  {
    id: "gold",
    name: "Gold",
    price: 95,
    minMeals: 50,
    popular: true,
    features: ["Premium packaging", "Menu customization", "Dedicated support", "Same day delivery available"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 85,
    minMeals: 100,
    popular: false,
    features: ["Luxury packaging", "Full menu customization", "Priority support", "Live tracking", "Setup assistance"],
  },
];

const eventTypes = [
  "Corporate Event",
  "Wedding",
  "Birthday Party",
  "College Fest",
  "Office Lunch",
  "Religious Gathering",
  "Other",
];

// --- Quote Form ---
function QuoteForm({ defaultPackage }: { defaultPackage: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    guests: "",
    date: "",
    pkg: defaultPackage,
    requirements: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
        <p className="text-gray-500">We'll contact you within 2 hours to confirm your bulk order details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Quote</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              required
              value={form.eventType}
              onChange={(e) => set("eventType", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="">Select event type</option>
              {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="absolute right-3 top-3 text-gray-400 pointer-events-none"><ChevronDownIcon /></div>
          </div>
        </div>
        {/* Number of Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests <span className="text-red-500">*</span></label>
          <input
            required
            type="number"
            min={20}
            value={form.guests}
            onChange={(e) => set("guests", e.target.value)}
            placeholder="Min. 20"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date <span className="text-red-500">*</span></label>
          <input
            required
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        {/* Preferred Package */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Package</label>
          <div className="relative">
            <select
              value={form.pkg}
              onChange={(e) => set("pkg", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="gold">Gold - ₹95/meal</option>
              <option value="silver">Silver - ₹110/meal</option>
              <option value="premium">Premium - ₹85/meal</option>
            </select>
            <div className="absolute right-3 top-3 text-gray-400 pointer-events-none"><ChevronDownIcon /></div>
          </div>
        </div>
      </div>

      {/* Additional Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
        <textarea
          rows={4}
          value={form.requirements}
          onChange={(e) => set("requirements", e.target.value)}
          placeholder="Tell us about menu preferences, special requirements, etc."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
        />
      </div>

      {/* Live Estimate */}
      {form.guests && form.pkg && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-orange-700 font-medium">
            💡 Estimated total:{" "}
            <span className="text-orange-600 font-bold text-base">
              ₹{(
                parseInt(form.guests) *
                (form.pkg === "silver" ? 110 : form.pkg === "gold" ? 95 : 85)
              ).toLocaleString("en-IN")}
            </span>{" "}
            for {form.guests} guests with {form.pkg.charAt(0).toUpperCase() + form.pkg.slice(1)} package
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition text-base"
      >
        Submit Request
      </button>
    </form>
  );
}

// --- Main Page ---
export default function BulkOrdersPage() {
  const [selectedPkg, setSelectedPkg] = useState("gold");

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-b from-orange-50 to-gray-50 py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Bulk Orders for Events &amp; Parties
        </h1>
        <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base md:text-lg">
          Perfect for corporate events, weddings, parties, and gatherings. Get special
          pricing and personalized service.
        </p>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <UsersIcon />, title: "Any Quantity", desc: "From 20 to 1000+ guests" },
            { icon: <ClockIcon />, title: "On-Time Delivery", desc: "Guaranteed timely service" },
            { icon: <ShieldIcon />, title: "Quality Assured", desc: "Fresh & hygienic meals" },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Choose Your Package
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isSelected = selectedPkg === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    isSelected || pkg.popular
                      ? "border-orange-500 shadow-lg"
                      : "border-gray-100 shadow hover:border-orange-300"
                  } bg-white`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{pkg.name}</h3>
                  <div className="text-center mb-1">
                    <span className="text-3xl font-bold text-orange-500">₹{pkg.price}</span>
                    <span className="text-gray-500 text-sm">/meal</span>
                  </div>
                  <p className="text-center text-gray-400 text-sm mb-5">Min. {pkg.minMeals} meals</p>

                  <ul className="space-y-2">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon />{f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setSelectedPkg(pkg.id);
                      document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`mt-6 w-full py-2.5 rounded-lg font-medium transition ${
                      isSelected || pkg.popular
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Get Quote
                  </button>
                </div>
              );
            })}
          </div>

          {/* Compare note */}
          <p className="text-center text-gray-400 text-sm mt-6">
            All packages include free delivery, GST invoice, and dedicated account manager.
          </p>
        </div>
      </section>

      {/* QUOTE FORM */}
      <section id="quote-form" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <QuoteForm defaultPackage={selectedPkg} />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Events Catered" },
            { value: "50,000+", label: "Meals Delivered" },
            { value: "4.9★", label: "Average Rating" },
            { value: "2 hrs", label: "Response Time" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-orange-500">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}