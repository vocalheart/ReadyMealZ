"use client";

import { useState } from "react";

// --- Types ---
type Plan = {
  id: string;
  label: string;
  days: number;
  pricePerMeal: number;
  total: number;
  savings: number | null;
  popular: boolean;
};


type MealTime = "lunch" | "dinner" | "both";

// --- Data ---
const plans: Plan[] = [
  { id: "3days", label: "3 Days Plan", days: 3, pricePerMeal: 99, total: 297, savings: null, popular: false },
  { id: "7days", label: "7 Days Plan", days: 7, pricePerMeal: 89, total: 623, savings: 70, popular: true },
  { id: "15days", label: "15 Days Plan", days: 15, pricePerMeal: 79, total: 1185, savings: 300, popular: false },
  { id: "30days", label: "30 Days Plan", days: 30, pricePerMeal: 69, total: 2070, savings: 900, popular: false },
];

const steps = ["Plan", "Timing", "Start Date", "Address", "Payment"];

// --- SVG Icons ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const UpiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const CodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// --- Step Indicator ---
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8 px-4 overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                    done
                      ? "bg-orange-500 border-orange-500 text-white"
                      : active
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}>
                  {done ? <CheckIcon /> : idx}
                </div>
                <span className={`mt-1 text-xs font-medium ${active ? "text-gray-900" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 md:w-24 h-0.5 mb-5 mx-1 ${idx < current ? "bg-orange-500" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Order Summary ---
function OrderSummary({
  plan,
  mealTime,
  startDate,
}: {
  plan: Plan | null;
  mealTime: MealTime | null;
  startDate: string;
}) {
  if (!plan) return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
      <p className="text-gray-400 text-sm">Select a plan to see your order summary.</p>
    </div>
  );

  const mealMultiplier = mealTime === "both" ? 2 : 1;
  const mealsTotal = plan.days * mealMultiplier;
  const subtotal = plan.pricePerMeal * mealsTotal;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Plan</span>
          <span className="font-medium text-gray-900">{plan.days} Days</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Price per meal</span>
          <span className="font-medium text-gray-900">₹{plan.pricePerMeal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Total meals</span>
          <span className="font-medium text-gray-900">{mealsTotal}</span>
        </div>
        {mealTime && (
          <div className="flex justify-between text-gray-600">
            <span>Meal time</span>
            <span className="font-medium text-gray-900 capitalize">{mealTime}</span>
          </div>
        )}
        {startDate && (
          <div className="flex justify-between text-gray-600">
            <span>Start date</span>
            <span className="font-medium text-gray-900">{startDate}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className="text-green-600 font-medium">FREE</span>
        </div>
        {plan.savings && (
          <div className="flex justify-between text-green-600 text-xs">
            <span>Savings</span>
            <span>-₹{plan.savings}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-orange-500">₹{subtotal}</span>
      </div>
    </div>
  );
}

// --- Step 1: Select Plan ---
function StepPlan({ selected, onSelect }: { selected: Plan | null; onSelect: (p: Plan) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Plan</h2>
      <div className="space-y-3">
        {plans.map((plan) => {
          const isSelected = selected?.id === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onSelect(plan)}
              className={`w-full text-left rounded-xl px-5 py-4 border-2 flex items-center gap-4 transition-all ${
                isSelected
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white border-gray-200 hover:border-orange-300"
              }`}
            >
              {/* Radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                isSelected ? "border-white" : "border-gray-400"
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-base ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {plan.label}
                  </span>
                  {plan.popular && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className={`text-sm mt-0.5 flex items-center gap-2 ${isSelected ? "text-orange-100" : "text-gray-500"}`}>
                  <span>₹{plan.pricePerMeal}/meal · Total: ₹{plan.total}</span>
                  {plan.savings && (
                    <span className={`font-medium ${isSelected ? "text-white" : "text-green-600"}`}>
                      Save ₹{plan.savings}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Step 2: Timing ---
function StepTiming({ selected, onSelect }: { selected: MealTime | null; onSelect: (t: MealTime) => void }) {
  const options: { id: MealTime; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "lunch", label: "Lunch Only", desc: "Delivered by 12:30 PM", icon: <SunIcon /> },
    { id: "dinner", label: "Dinner Only", desc: "Delivered by 7:30 PM", icon: <MoonIcon /> },
    { id: "both", label: "Lunch + Dinner", desc: "Both meals daily (2x meals)", icon: <><SunIcon /><MoonIcon /></> },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Meal Timing</h2>
      <p className="text-gray-500 text-sm mb-6">When would you like your meals delivered?</p>
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full text-left rounded-xl px-5 py-4 border-2 flex items-center gap-4 transition-all ${
                isSelected ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-200 hover:border-orange-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? "border-white" : "border-gray-400"}`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <div className={`flex items-center gap-2 ${isSelected ? "text-white" : "text-orange-500"}`}>
                {opt.icon}
              </div>
              <div>
                <div className={`font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>{opt.label}</div>
                <div className={`text-sm ${isSelected ? "text-orange-100" : "text-gray-500"}`}>{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Step 3: Start Date ---
function StepStartDate({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Start Date</h2>
      <p className="text-gray-500 text-sm mb-6">Select when you'd like your subscription to begin.</p>
      <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <CalendarIcon /> Start Date
        </label>
        <input
          type="date"
          min={today}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        {value && (
          <p className="mt-3 text-sm text-green-600 font-medium">
            ✓ Your subscription starts on {new Date(value).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Step 4: Address ---
function StepAddress({
  address,
  onChange,
}: {
  address: Record<string, string>;
  onChange: (k: string, v: string) => void;
}) {
  const fields = [
    { key: "name", label: "Full Name", placeholder: "Rahul Sharma", type: "text" },
    { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
    { key: "flat", label: "Flat / House No.", placeholder: "B-204, Sunshine Apartments", type: "text" },
    { key: "area", label: "Area / Street", placeholder: "Arera Colony, Zone 2", type: "text" },
    { key: "landmark", label: "Landmark (optional)", placeholder: "Near City Mall", type: "text" },
    { key: "pincode", label: "Pincode", placeholder: "462016", type: "text" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Address</h2>
      <p className="text-gray-500 text-sm mb-6">Where should we deliver your meals?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.key === "flat" || f.key === "area" ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={address[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Step 5: Payment ---
function StepPayment({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  const methods = [
    { id: "upi", label: "UPI / GPay / PhonePe", desc: "Pay instantly via UPI", icon: <UpiIcon /> },
    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: <CreditCardIcon /> },
    { id: "cod", label: "Cash on Delivery", desc: "Pay when meal arrives", icon: <CodIcon /> },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
      <p className="text-gray-500 text-sm mb-6">Choose how you'd like to pay.</p>
      <div className="space-y-3">
        {methods.map((m) => {
          const isSelected = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`w-full text-left rounded-xl px-5 py-4 border-2 flex items-center gap-4 transition-all ${
                isSelected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-200 hover:border-orange-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? "border-white" : "border-gray-400"}`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <div className={`${isSelected ? "text-white" : "text-orange-500"}`}>{m.icon}</div>
              <div>
                <div className={`font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>{m.label}</div>
                <div className={`text-sm ${isSelected ? "text-orange-100" : "text-gray-500"}`}>{m.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selected === "upi" && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
          <input type="text" placeholder="yourname@upi" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
        </div>
      )}
      {selected === "card" && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input type="text" placeholder="MM/YY" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input type="password" placeholder="•••" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Success Screen ---
function SuccessScreen({ plan }: { plan: Plan | null }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Subscription Confirmed!</h2>
      <p className="text-gray-500 mb-1">Your {plan?.label} has been placed successfully.</p>
      <p className="text-gray-500 mb-8">Fresh meals will start arriving at your doorstep soon. 🎉</p>
      <a href="/" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition">
        Back to Home
      </a>
    </div>
  );
}

// --- Main Page ---
export default function SubscribePage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0]);
  const [mealTime, setMealTime] = useState<MealTime | null>("lunch");
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [submitted, setSubmitted] = useState(false);

  const canContinue = () => {
    if (step === 1) return !!selectedPlan;
    if (step === 2) return !!mealTime;
    if (step === 3) return !!startDate;
    if (step === 4) return !!(address.name && address.phone && address.flat && address.area && address.pincode);
    if (step === 5) return !!paymentMethod;
    return true;
  };

  const handleContinue = () => {
    if (step < 5) setStep(step + 1);
    else setSubmitted(true);
  };

  if (submitted) return <div className="min-h-screen bg-gray-50"><SuccessScreen plan={selectedPlan} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Main Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {step === 1 && <StepPlan selected={selectedPlan} onSelect={setSelectedPlan} />}
            {step === 2 && <StepTiming selected={mealTime} onSelect={setMealTime} />}
            {step === 3 && <StepStartDate value={startDate} onChange={setStartDate} />}
            {step === 4 && <StepAddress address={address} onChange={(k, v) => setAddress((p) => ({ ...p, [k]: v }))} />}
            {step === 5 && <StepPayment selected={paymentMethod} onSelect={setPaymentMethod} />}

            {/* Navigation */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <ArrowLeftIcon /> Back
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition ${
                  canContinue()
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-orange-300 cursor-not-allowed"
                }`}
              >
                {step === 5 ? "Place Order" : "Continue"} <ArrowRightIcon />
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary plan={selectedPlan} mealTime={mealTime} startDate={startDate} />
          </div>
        </div>
      </div>
    </div>
  );
}