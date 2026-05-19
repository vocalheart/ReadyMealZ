"use client";

import { useState } from "react";
import Link from "next/link";
import {Search,ChevronDown,ChevronUp,MessageCircle,Phone,Mail,Clock,ShoppingBag,Truck,RefreshCw,CreditCard,User,Star,ArrowRight,MapPin,} from "lucide-react";
// ── Types ────────────────────────────────────────────────────────────────────
interface FAQ {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  faqs: FAQ[];
}

// ── Data ─────────────────────────────────────────────────────────────────────
const categories: Category[] = [
  {
    id: "orders",
    icon: ShoppingBag,
    label: "Orders",
    color: "text-orange-500",
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "You can place an order directly through our website by browsing the menu, adding items to your cart, and completing checkout. We accept orders up to 11 PM for next-day delivery.",
      },
      {
        question: "Can I schedule a meal in advance?",
        answer:
          "Yes! You can schedule meals up to 7 days in advance. Simply choose your preferred delivery date and time slot at checkout.",
      },
      {
        question: "What is the minimum order amount?",
        answer:
          "The minimum order amount is ₹99. Orders above ₹299 get free delivery.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be modified or cancelled up to 2 hours before the scheduled delivery time. Please contact us via phone or WhatsApp for quick assistance.",
      },
    ],
  },
  {
    id: "delivery",
    icon: Truck,
    label: "Delivery",
    color: "text-blue-500",
    faqs: [
      {
        question: "What are the delivery areas?",
        answer:
          "We currently deliver across Bhopal including areas like Govind Garden, Arera Colony, MP Nagar, Kolar Road, and many more. Enter your pincode on the menu page to check availability.",
      },
      {
        question: "What are the delivery timings?",
        answer:
          "We deliver lunch between 12 PM – 2 PM and dinner between 7 PM – 9 PM, 7 days a week including Sundays and public holidays.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Deliveries typically arrive within 30–60 minutes of dispatch. You'll receive a real-time SMS update when your order is out for delivery.",
      },
      {
        question: "Is there a delivery charge?",
        answer:
          "A delivery fee of ₹20 applies for orders below ₹299. Orders of ₹299 and above enjoy free delivery.",
      },
    ],
  },
  {
    id: "refunds",
    icon: RefreshCw,
    label: "Refunds",
    color: "text-green-500",
    faqs: [
      {
        question: "What is your refund policy?",
        answer:
          "We offer a 100% money-back guarantee if you are unsatisfied with your meal quality. Raise a complaint within 2 hours of delivery and we'll process your refund within 24–48 hours.",
      },
      {
        question: "How do I request a refund?",
        answer:
          "Contact us via WhatsApp at +91 96303 02626 or email hello@readymealz.com with your order ID and a brief description of the issue. Our team will resolve it promptly.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are credited to your original payment method within 3–5 business days after approval. UPI refunds are usually instant.",
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    label: "Payment",
    color: "text-purple-500",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept UPI (GPay, PhonePe, Paytm), credit/debit cards, net banking, and cash on delivery.",
      },
      {
        question: "Is online payment secure?",
        answer:
          "Absolutely. All transactions are encrypted and processed through Razorpay, a RBI-certified payment gateway. We never store your card details.",
      },
      {
        question: "Can I pay cash on delivery?",
        answer:
          "Yes, cash on delivery is available for all orders. Please keep exact change ready to help our delivery partners.",
      },
    ],
  },
  {
    id: "account",
    icon: User,
    label: "Account",
    color: "text-yellow-500",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign Up' on the top-right of the website, enter your mobile number, verify via OTP, and you're all set!",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "We use OTP-based login, so no password is needed. Simply enter your registered mobile number and verify with the OTP sent to you.",
      },
      {
        question: "How do I update my delivery address?",
        answer:
          "Log in to your account, go to 'My Profile' → 'Saved Addresses', and add or edit your address anytime.",
      },
    ],
  },
  {
    id: "quality",
    icon: Star,
    label: "Quality",
    color: "text-red-500",
    faqs: [
      {
        question: "How fresh are the meals?",
        answer:
          "Every meal is freshly prepared on the same day of delivery. We do not use frozen or pre-cooked food. Ingredients are sourced fresh every morning.",
      },
      {
        question: "Are the meals hygienic?",
        answer:
          "Our kitchen follows strict FSSAI hygiene standards. All our chefs undergo regular health checkups and food-safety training.",
      },
      {
        question: "Do you offer vegetarian and non-vegetarian options?",
        answer:
          "We primarily offer vegetarian meals. Select non-vegetarian items are available on specific days — check the daily menu for details.",
      },
    ],
  },
];

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        open ? "border-orange-300 shadow-md" : "border-gray-200"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-orange-50 transition-colors"
      >
        <span className="text-sm sm:text-base font-medium text-gray-800 pr-4">
          {faq.question}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-orange-50 border-t border-orange-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-3">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("orders");

  const activeData = categories.find((c) => c.id === activeCategory)!;

  const filteredFAQs = search.trim()
    ? categories.flatMap((cat) =>
        cat.faqs
          .filter(
            (f) =>
              f.question.toLowerCase().includes(search.toLowerCase()) ||
              f.answer.toLowerCase().includes(search.toLowerCase())
          )
          .map((f) => ({ ...f, category: cat.label }))
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Help Center</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <MessageCircle className="w-3.5 h-3.5" />
              Help Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              How can we <span className="text-orange-600">help you?</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-7">
              Find answers to common questions or reach out to our support team.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your question here…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── Search Results ───────────────────────────────────────────── */}
        {filteredFAQs !== null ? (
          <div>
            <p className="text-sm text-gray-500 mb-5">
              {filteredFAQs.length > 0
                ? `${filteredFAQs.length} result${filteredFAQs.length > 1 ? "s" : ""} found for "${search}"`
                : `No results found for "${search}"`}
            </p>
            {filteredFAQs.length > 0 ? (
              <div className="space-y-3">
                {filteredFAQs.map((faq, i) => (
                  <div key={i}>
                    <span className="inline-block text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5 mb-2">
                      {faq.category}
                    </span>
                    <FAQItem faq={faq} index={i} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Try different keywords or browse categories below.</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm text-orange-600 hover:underline"
                >
                  Browse all topics →
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── Category Tabs ──────────────────────────────────────────── */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition border ${
                      active
                        ? "bg-orange-500 text-white border-orange-500 shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* ── FAQ Panel ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Category list (desktop sidebar) */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-gray-800">Topics</h2>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const active = cat.id === activeCategory;
                      return (
                        <li key={cat.id}>
                          <button
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm text-left transition ${
                              active
                                ? "bg-orange-50 text-orange-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${active ? "text-orange-500" : "text-gray-400"}`} />
                            {cat.label}
                            {active && (
                              <ArrowRight className="w-3.5 h-3.5 ml-auto text-orange-400" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Right: FAQ list */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  {(() => {
                    const Icon = activeData.icon;
                    return (
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-orange-500" />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {activeData.label}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {activeData.faqs.length} questions
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {activeData.faqs.map((faq, i) => (
                    <FAQItem key={i} faq={faq} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Still Need Help ──────────────────────────────────────────────── */}
        <div className="mt-14 bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Still need help?
            </h2>
            <p className="text-sm text-gray-500">
              Our friendly support team is here for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919630302626"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-bold text-gray-800 mb-0.5">WhatsApp</span>
              <span className="text-xs text-gray-500 mb-2">Fastest response</span>
              <span className="text-sm font-semibold text-green-600">+91 96303 02626</span>
            </a>

            {/* Call */}
            <a
              href="tel:+919630302626"
              className="group flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3 group-hover:bg-orange-200 transition">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-bold text-gray-800 mb-0.5">Call Us</span>
              <span className="text-xs text-gray-500 mb-2">Mon–Sun, 9 AM – 9 PM</span>
              <span className="text-sm font-semibold text-orange-600">+91 96303 02626</span>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@readymealz.com"
              className="group flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-800 mb-0.5">Email Us</span>
              <span className="text-xs text-gray-500 mb-2">Reply within 24 hrs</span>
              <span className="text-sm font-semibold text-blue-600">hello@readymealz.com</span>
            </a>
          </div>

          {/* Support hours note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Support available 7 days a week · 9:00 AM – 9:00 PM</span>
          </div>
        </div>

        {/* ── Visit Us ──────────────────────────────────────────────────────── */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 mb-0.5">Visit Our Kitchen</p>
            <p className="text-sm text-gray-600">
              Duggal Complex, Shop No. 2 Ground Floor, Raisen Rd, Govind Garden, Bhopal, MP 462023
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Duggal+Complex+Raisen+Road+Govind+Garden+Bhopal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:underline"
          >
            Get Directions <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}