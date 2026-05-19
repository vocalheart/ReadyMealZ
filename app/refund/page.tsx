"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  MessageCircle,
  ShoppingBag,
  Truck,
  Shield,
  HelpCircle,
} from "lucide-react";

// ── Section Data ──────────────────────────────────────────────────────────────
const sections = [
  {
    id: "overview",
    icon: RefreshCw,
    title: "Refund Policy Overview",
    content: [
      {
        text: "At A1Meals / ReadyMealz, customer satisfaction is our top priority. We stand behind the quality of every meal we deliver. If something goes wrong, we are here to make it right.",
      },
      {
        text: "This Refund & Cancellation Policy outlines the conditions under which refunds are granted, how to request one, and what to expect during the process.",
      },
      {
        text: "By placing an order with us, you agree to the terms outlined in this policy. We encourage you to read this carefully before placing your first order.",
      },
    ],
  },
  {
    id: "eligible",
    icon: CheckCircle,
    title: "Refund Eligible Cases",
    content: [
      {
        heading: "Wrong Order Delivered",
        text: "If you receive a meal that is different from what you ordered, you are entitled to a full refund or a complimentary replacement at no extra charge.",
      },
      {
        heading: "Significant Quality Issues",
        text: "If your meal is found to be spoiled, contaminated, or of significantly poor quality compared to our standard, we will issue a full refund upon review.",
      },
      {
        heading: "Non-Delivery",
        text: "If your order is not delivered within 60 minutes of the scheduled delivery window and no prior communication was made, you are eligible for a full refund.",
      },
      {
        heading: "Missing Items",
        text: "If one or more items from your order are missing, we will refund the value of the missing items or arrange a prompt re-delivery.",
      },
      {
        heading: "Duplicate Payment",
        text: "If you are charged twice for the same order due to a technical error, the duplicate amount will be refunded within 3–5 business days.",
      },
    ],
  },
  {
    id: "not-eligible",
    icon: XCircle,
    title: "Non-Refundable Cases",
    content: [
      {
        heading: "Customer Unavailability",
        text: "If a delivery attempt was made and the customer was not available at the delivery address, the order will not be eligible for a refund.",
      },
      {
        heading: "Late Complaints",
        text: "Complaints raised more than 2 hours after the scheduled delivery time will not be eligible for a refund, as we are unable to verify the condition of the meal.",
      },
      {
        heading: "Incorrect Address",
        text: "If the delivery fails due to an incorrect or incomplete address provided by the customer, the order is non-refundable.",
      },
      {
        heading: "Change of Mind",
        text: "Orders cancelled after the 2-hour pre-delivery cut-off due to a change of mind are not eligible for a refund.",
      },
      {
        heading: "Taste Preferences",
        text: "Refunds are not provided for personal taste preferences, as our meals are prepared to a consistent standard. We welcome feedback to improve.",
      },
    ],
  },
  {
    id: "cancellation",
    icon: ShoppingBag,
    title: "Order Cancellation",
    content: [
      {
        heading: "Cancellation Window",
        text: "You may cancel your order up to 2 hours before the scheduled delivery time for a full refund. Cancellations within 2 hours of delivery will not be eligible for a refund.",
      },
      {
        heading: "How to Cancel",
        text: "To cancel an order, contact us via WhatsApp at +91 96303 02626 or call us directly. Please have your order ID ready for faster processing.",
      },
      {
        heading: "Subscription Cancellations",
        text: "Subscription plans must be paused or cancelled at least 24 hours in advance. Unused subscription days may be credited to your wallet at our discretion but will not be refunded as cash.",
      },
      {
        heading: "Our Right to Cancel",
        text: "We reserve the right to cancel any order due to ingredient unavailability, delivery constraints, or circumstances beyond our control. In such cases, a full refund will be issued immediately.",
      },
    ],
  },
  {
    id: "process",
    icon: Clock,
    title: "Refund Process",
    content: [
      {
        heading: "Step 1 — Raise a Complaint",
        text: "Contact our support team via WhatsApp (+91 96303 02626) or email (hello@readymealz.com) within 2 hours of the scheduled delivery time. Share your order ID and a brief description of the issue.",
      },
      {
        heading: "Step 2 — Review",
        text: "Our team will review your complaint, which may include requesting photos of the meal or delivery. We aim to respond within 2–4 hours of receiving your complaint.",
      },
      {
        heading: "Step 3 — Approval",
        text: "Upon review, if your complaint is valid, the refund will be approved. You will receive a confirmation via WhatsApp or email with the refund amount and timeline.",
      },
      {
        heading: "Step 4 — Credit",
        text: "The approved refund will be credited to your original payment method or A1Meals wallet within the timelines mentioned below.",
      },
    ],
  },
  {
    id: "timeline",
    icon: CreditCard,
    title: "Refund Timelines",
    content: [
      {
        heading: "UPI & Wallets",
        text: "Refunds to UPI-linked accounts (Google Pay, PhonePe, Paytm) and digital wallets are typically processed instantly to within 24 hours of approval.",
      },
      {
        heading: "Debit / Credit Cards",
        text: "Card refunds are processed within 3–5 business days from the date of approval, depending on your bank's processing time.",
      },
      {
        heading: "Net Banking",
        text: "Net banking refunds are credited within 5–7 business days from the date of approval.",
      },
      {
        heading: "Cash on Delivery",
        text: "For COD orders, refunds are credited to your A1Meals wallet or transferred via UPI within 24–48 hours of approval.",
      },
      {
        heading: "A1Meals Wallet",
        text: "Refunds to your A1Meals in-app wallet are instant and can be used for future orders.",
      },
    ],
  },
  {
    id: "delivery-issues",
    icon: Truck,
    title: "Delivery-Related Issues",
    content: [
      {
        heading: "Delayed Delivery",
        text: "If your order is delayed beyond 60 minutes of the promised delivery window, please contact us. Depending on the severity, we may offer a partial refund, discount on next order, or full refund.",
      },
      {
        heading: "Damaged Packaging",
        text: "If your meal arrives with significantly damaged packaging that affects the food, please take a photo and contact us immediately. We will review and issue an appropriate resolution.",
      },
      {
        heading: "Partial Delivery",
        text: "If only part of your order is delivered, we will refund the value of the undelivered items or arrange a re-delivery at the earliest possible time.",
      },
    ],
  },
  {
    id: "contact",
    icon: MessageCircle,
    title: "How to Reach Us",
    content: [
      {
        heading: "WhatsApp (Fastest)",
        text: "Send a message to +91 96303 02626 on WhatsApp with your order ID and issue. This is the fastest way to get a resolution — we typically respond within 30 minutes during operating hours.",
      },
      {
        heading: "Phone",
        text: "Call us at +91 96303 02626 between 9:00 AM and 9:00 PM, 7 days a week. Our support team is ready to assist you.",
      },
      {
        heading: "Email",
        text: "Write to us at hello@readymealz.com with your order ID, registered mobile number, and a description of your issue. We respond to all emails within 24 hours.",
      },
    ],
  },
];

// ── Timeline visual ───────────────────────────────────────────────────────────
const refundSteps = [
  { step: "01", label: "Raise Complaint", sub: "Within 2 hrs of delivery", icon: MessageCircle },
  { step: "02", label: "Team Reviews", sub: "2–4 hrs response time", icon: HelpCircle },
  { step: "03", label: "Refund Approved", sub: "Confirmation sent to you", icon: CheckCircle },
  { step: "04", label: "Amount Credited", sub: "As per payment method", icon: CreditCard },
];

// ── Section Block ─────────────────────────────────────────────────────────────
function SectionBlock({
  section,
  index,
}: {
  section: (typeof sections)[0];
  index: number;
}) {
  const Icon = section.icon;
  return (
    <div id={section.id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-orange-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          <span className="text-orange-500 mr-2 font-semibold text-base">
            {String(index + 1).padStart(2, "0")}.
          </span>
          {section.title}
        </h2>
      </div>

      <div className="space-y-4 pl-0 sm:pl-12">
        {section.content.map((item, i) => (
          <div key={i}>
            {item.heading && (
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                {item.heading}
              </h3>
            )}
            <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-b border-gray-100" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">Refund Policy</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <RefreshCw className="w-3.5 h-3.5" />
                Refund & Cancellation
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Refund <span className="text-orange-600">Policy</span>
              </h1>
              <p className="text-sm text-gray-500 max-w-xl">
                We offer a 100% money-back guarantee on valid complaints. Here's
                everything you need to know about our refund process.
              </p>
            </div>
            <div className="flex-shrink-0 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-gray-600 mb-0.5">Last Updated</p>
              <p>May 2025</p>
            </div>
          </div>

          {/* Guarantee badges */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: Shield, label: "100% Money-Back Guarantee" },
              { icon: Clock, label: "24–48 Hr Resolution" },
              { icon: CheckCircle, label: "No Questions Asked" },
              { icon: CreditCard, label: "Instant UPI Refunds" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ── Sidebar TOC ───────────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-800">Contents</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {sections.map((s, i) => {
                    const Icon = s.icon;
                    const active = activeSection === s.id;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => scrollTo(s.id)}
                          className={`w-full flex items-center gap-3 px-5 py-3 text-xs text-left transition ${
                            active
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`text-[10px] font-bold ${active ? "text-orange-400" : "text-gray-400"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-orange-500" : "text-gray-400"}`} />
                          <span className="leading-tight">{s.title}</span>
                          {active && <ChevronRight className="w-3 h-3 ml-auto text-orange-400" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Quick refund CTA in sidebar */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-gray-800 mb-1">Need a refund?</p>
                <p className="text-xs text-gray-500 mb-4">Contact us within 2 hours of delivery.</p>
                <a
                  href="https://wa.me/919630302626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </aside>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <div className="lg:col-span-3">

            {/* Mobile TOC pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-8 lg:hidden scrollbar-hide">
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    activeSection === s.id
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}. {s.title}
                </button>
              ))}
            </div>

            {/* Intro alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 leading-relaxed">
                All refund complaints must be raised{" "}
                <strong>within 2 hours of the scheduled delivery time.</strong>{" "}
                Late complaints cannot be processed. For quick help,{" "}
                <a
                  href="https://wa.me/919630302626"
                  className="font-semibold underline hover:text-orange-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>{" "}
                or call{" "}
                <a href="tel:+919630302626" className="font-semibold underline hover:text-orange-600">
                  +91 96303 02626
                </a>
                .
              </p>
            </div>

            {/* ── Refund Steps Visual ───────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                How the Refund Process Works
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {refundSteps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="flex flex-col items-center text-center relative">
                      {i < refundSteps.length - 1 && (
                        <div className="hidden sm:block absolute top-5 left-[60%] w-full h-px bg-orange-200 z-0" />
                      )}
                      <div className="relative z-10 w-10 h-10 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-[10px] font-bold text-orange-400 mb-1">
                        STEP {s.step}
                      </span>
                      <p className="text-xs font-semibold text-gray-800 mb-0.5">{s.label}</p>
                      <p className="text-[11px] text-gray-400">{s.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Eligible vs Not Eligible quick reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-bold text-green-800">You're Eligible If…</h3>
                </div>
                <ul className="space-y-2">
                  {["Wrong order delivered", "Spoiled or poor quality meal", "Order not delivered", "Missing items in order", "Duplicate payment charged"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-green-700">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-[10px]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm font-bold text-red-800">Not Eligible If…</h3>
                </div>
                <ul className="space-y-2">
                  {["Customer was unavailable", "Complaint after 2-hour window", "Wrong address provided", "Cancelled after cut-off time", "Personal taste preference"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-red-700">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-[10px]">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Refund Timeline table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-bold text-gray-800">Refund Timeline by Payment Method</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { method: "UPI / Wallets", time: "Instant – 24 hrs", badge: "bg-green-100 text-green-700" },
                  { method: "Debit / Credit Card", time: "3–5 Business Days", badge: "bg-blue-100 text-blue-700" },
                  { method: "Net Banking", time: "5–7 Business Days", badge: "bg-purple-100 text-purple-700" },
                  { method: "Cash on Delivery (COD)", time: "24–48 hrs (via UPI/Wallet)", badge: "bg-yellow-100 text-yellow-700" },
                  { method: "A1Meals Wallet", time: "Instant", badge: "bg-green-100 text-green-700" },
                ].map((row) => (
                  <div key={row.method} className="flex items-center justify-between px-5 sm:px-6 py-3.5">
                    <span className="text-sm text-gray-700">{row.method}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.badge}`}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* All Sections */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 sm:px-8 py-8 space-y-10">
              {sections.map((section, i) => (
                <SectionBlock key={section.id} section={section} index={i} />
              ))}
            </div>

            {/* ── Contact ───────────────────────────────────────────────── */}
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Need Help with a Refund?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Our team is available 7 days a week, 9 AM – 9 PM.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="https://wa.me/919630302626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-sm font-semibold text-gray-800">+91 96303 02626</p>
                  </div>
                </a>
                <a
                  href="tel:+919630302626"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition">
                    <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call Us</p>
                    <p className="text-sm font-semibold text-gray-800">+91 96303 02626</p>
                  </div>
                </a>
                <a
                  href="mailto:hello@readymealz.com"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-gray-800">hello@readymealz.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Help Center", href: "/help" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-sm font-medium text-gray-700 hover:text-orange-600 transition shadow-sm group"
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}