"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  ShoppingBag,
  Truck,
  CreditCard,
  RefreshCw,
  Shield,
  AlertCircle,
  Users,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ── Section Data ──────────────────────────────────────────────────────────────
const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      {
        text: "By accessing or using the A1Meals / ReadyMealz website, mobile application, or any of our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.",
      },
      {
        text: "We reserve the right to update or modify these Terms at any time without prior notice. Continued use of our services after any such changes constitutes your acceptance of the new Terms.",
      },
      {
        text: "These Terms apply to all visitors, users, and others who access or use our services.",
      },
    ],
  },
  {
    id: "services",
    icon: ShoppingBag,
    title: "Our Services",
    content: [
      {
        heading: "Tiffin & Meal Delivery",
        text: "A1Meals provides fresh, home-cooked meal delivery services in Bhopal. We prepare and deliver daily tiffin meals (lunch and dinner) to registered customers.",
      },
      {
        heading: "Bulk Orders",
        text: "We accept bulk orders for corporate events, functions, and gatherings. Bulk orders must be placed at least 48 hours in advance and are subject to availability.",
      },
      {
        heading: "Service Availability",
        text: "Our services are currently available in select areas of Bhopal, Madhya Pradesh. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.",
      },
      {
        heading: "Menu Changes",
        text: "Our daily menu is subject to change based on ingredient availability, seasons, and operational requirements. We endeavour to keep the menu updated on our platform.",
      },
    ],
  },
  {
    id: "ordering",
    icon: ShoppingBag,
    title: "Ordering & Subscriptions",
    content: [
      {
        heading: "Order Placement",
        text: "Orders must be placed before 11:00 PM for next-day delivery. Orders placed after the cut-off time will be scheduled for the following day.",
      },
      {
        heading: "Order Confirmation",
        text: "You will receive an SMS or WhatsApp confirmation once your order is successfully placed. Please ensure your contact number is correct at the time of ordering.",
      },
      {
        heading: "Order Modification & Cancellation",
        text: "Orders can be modified or cancelled up to 2 hours before the scheduled delivery time. Cancellations after this window may not be eligible for a refund.",
      },
      {
        heading: "Subscription Plans",
        text: "Subscription meals are prepaid and non-transferable. Pausing or cancelling a subscription plan must be communicated at least 24 hours in advance. Unused subscription days may be credited to your account at our discretion.",
      },
    ],
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Delivery Policy",
    content: [
      {
        heading: "Delivery Areas",
        text: "We deliver to select pin codes in Bhopal. Availability can be verified by entering your address on our menu page. We are not liable for delays caused by incorrect addresses provided by the customer.",
      },
      {
        heading: "Delivery Timings",
        text: "Lunch is delivered between 12:00 PM – 2:00 PM and dinner between 7:00 PM – 9:00 PM. Delivery times are estimates and may vary due to traffic, weather, or other unforeseen circumstances.",
      },
      {
        heading: "Failed Deliveries",
        text: "If a delivery attempt fails due to the customer being unavailable or an incorrect address, we reserve the right to charge for the order without a refund.",
      },
      {
        heading: "Delivery Charges",
        text: "A delivery fee of ₹20 applies to orders below ₹299. Free delivery is applicable on orders of ₹299 and above. Delivery charges are subject to change.",
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment Terms",
    content: [
      {
        heading: "Accepted Payment Methods",
        text: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and cash on delivery. All digital payments are processed through Razorpay, a PCI-DSS compliant payment gateway.",
      },
      {
        heading: "Pricing",
        text: "All prices displayed on our platform are inclusive of applicable taxes. Prices are subject to change without prior notice. The price at the time of order placement will be the final price charged.",
      },
      {
        heading: "Payment Security",
        text: "We do not store your card or banking details on our servers. All transactions are encrypted and handled by our payment gateway partner.",
      },
      {
        heading: "Failed Transactions",
        text: "In the event of a failed transaction where the amount is debited from your account, it will be automatically refunded to your original payment method within 5–7 business days.",
      },
    ],
  },
  {
    id: "refunds",
    icon: RefreshCw,
    title: "Refund & Cancellation",
    content: [
      {
        heading: "Refund Eligibility",
        text: "Refunds are applicable in cases of wrong order delivered, significant quality issues, or non-delivery. Complaints must be raised within 2 hours of the scheduled delivery time.",
      },
      {
        heading: "Refund Process",
        text: "To request a refund, contact our support team via WhatsApp or email with your order ID and a description of the issue. Our team will review and respond within 24 hours.",
      },
      {
        heading: "Refund Timeline",
        text: "Approved refunds will be credited to your original payment method within 3–5 business days. UPI and wallet refunds may be processed faster.",
      },
      {
        heading: "Non-Refundable Cases",
        text: "Refunds will not be provided for orders where the customer was unavailable at delivery, orders cancelled after the cut-off window, or complaints raised after the 2-hour window.",
      },
    ],
  },
  {
    id: "conduct",
    icon: Users,
    title: "User Conduct",
    content: [
      {
        heading: "Acceptable Use",
        text: "You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of our services.",
      },
      {
        heading: "Account Responsibility",
        text: "You are responsible for maintaining the confidentiality of your account credentials. Any activity performed through your account is your responsibility.",
      },
      {
        heading: "Prohibited Activities",
        text: "You must not misuse our platform by introducing viruses, attempting to gain unauthorised access, placing fraudulent orders, or using our services for any illegal purpose.",
      },
      {
        heading: "Termination",
        text: "We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent behaviour, or misuse our services.",
      },
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy & Data",
    content: [
      {
        heading: "Data Collection",
        text: "We collect personal information such as your name, contact number, delivery address, and payment details solely for the purpose of fulfilling your orders.",
      },
      {
        heading: "Data Usage",
        text: "Your data is used to process orders, communicate updates, and improve our services. We do not sell or share your personal information with third parties except as required to fulfil your orders.",
      },
      {
        heading: "Cookies",
        text: "Our website uses cookies to enhance your browsing experience. By using our website, you consent to the use of cookies as described in our Cookie Policy.",
      },
      {
        heading: "Data Security",
        text: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.",
      },
    ],
  },
  {
    id: "liability",
    icon: AlertCircle,
    title: "Limitation of Liability",
    content: [
      {
        text: "A1Meals shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our services.",
      },
      {
        text: "We do not guarantee that our services will be error-free, uninterrupted, or free from delays. We are not responsible for delays caused by third-party delivery partners, weather conditions, or force majeure events.",
      },
      {
        text: "Our total liability to you for any claim arising from these Terms shall not exceed the amount paid by you for the specific order giving rise to the claim.",
      },
      {
        text: "We make no warranties, express or implied, regarding the quality, fitness, or suitability of our meals for any specific dietary requirement, allergy, or medical condition beyond what is stated on our menu.",
      },
    ],
  },
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
      {/* Section Header */}
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

      {/* Content */}
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
export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("acceptance");

  // Highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">
              Terms & Conditions
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <FileText className="w-3.5 h-3.5" />
                Legal
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Terms &{" "}
                <span className="text-orange-600">Conditions</span>
              </h1>
              <p className="text-sm text-gray-500 max-w-xl">
                Please read these terms carefully before using our services.
                By placing an order, you agree to be bound by these terms.
              </p>
            </div>
            {/* Last updated */}
            <div className="flex-shrink-0 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-gray-600 mb-0.5">Last Updated</p>
              <p>May 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ── Sidebar TOC (desktop) ─────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800">
                  Table of Contents
                </h2>
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
                        <span
                          className={`text-[10px] font-bold ${
                            active ? "text-orange-400" : "text-gray-400"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Icon
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            active ? "text-orange-500" : "text-gray-400"
                          }`}
                        />
                        <span className="leading-tight">{s.title}</span>
                        {active && (
                          <ChevronRight className="w-3 h-3 ml-auto text-orange-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {/* Mobile TOC pill strip */}
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

            {/* Intro note */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-10 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 leading-relaxed">
                These Terms & Conditions govern your use of A1Meals / ReadyMealz
                services. By placing an order or using our platform, you confirm
                that you have read, understood, and agreed to these terms. If
                you have any questions, please{" "}
                <Link
                  href="/help"
                  className="font-semibold underline hover:text-orange-600"
                >
                  contact our support team
                </Link>
                .
              </p>
            </div>

            {/* Sections */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 sm:px-8 py-8 space-y-10">
              {sections.map((section, i) => (
                <SectionBlock key={section.id} section={section} index={i} />
              ))}

              {/* Governing Law */}
              <div id="governing-law" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    <span className="text-orange-500 mr-2 font-semibold text-base">
                      10.
                    </span>
                    Governing Law
                  </h2>
                </div>
                <div className="space-y-3 pl-0 sm:pl-12">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    These Terms shall be governed by and construed in accordance
                    with the laws of India. Any disputes arising under or in
                    connection with these Terms shall be subject to the exclusive
                    jurisdiction of the courts located in Bhopal, Madhya Pradesh.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    If any provision of these Terms is found to be invalid or
                    unenforceable, the remaining provisions shall continue in
                    full force and effect.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Contact for Legal Queries ─────────────────────────────── */}
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Questions about these Terms?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Reach out to us and we'll be happy to clarify.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="tel:+919630302626"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition">
                    <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call Us</p>
                    <p className="text-sm font-semibold text-gray-800">
                      +91 96303 02626
                    </p>
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
                    <p className="text-sm font-semibold text-gray-800">
                      hello@readymealz.com
                    </p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      Govind Garden, Bhopal, MP 462023
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refund" },
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