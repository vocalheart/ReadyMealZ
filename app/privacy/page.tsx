"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  Cookie,
  UserCheck,
  Trash2,
  Bell,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  FileText,
} from "lucide-react";

// ── Section Data ──────────────────────────────────────────────────────────────
const sections = [
  {
    id: "overview",
    icon: Shield,
    title: "Overview",
    content: [
      {
        text: "At A1Meals / ReadyMealz, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, and share your information when you use our website, mobile application, or any of our services.",
      },
      {
        text: "By using our services, you agree to the collection and use of information as described in this policy. If you do not agree with the terms of this Privacy Policy, please discontinue the use of our services.",
      },
      {
        text: "This policy applies to all users of our platform, including visitors, registered customers, and bulk order clients.",
      },
    ],
  },
  {
    id: "data-collected",
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        heading: "Personal Identification Information",
        text: "When you register or place an order, we collect your full name, mobile number, email address, and delivery address. This information is essential for account creation and order fulfilment.",
      },
      {
        heading: "Payment Information",
        text: "We collect transaction details such as payment method, amount, and transaction ID. We do not store your full card number, CVV, or banking credentials — these are handled securely by our payment gateway partner, Razorpay.",
      },
      {
        heading: "Order & Usage Data",
        text: "We collect information about the orders you place, your preferences, browsing history on our platform, and interactions with our customer support team.",
      },
      {
        heading: "Device & Technical Data",
        text: "We may collect your IP address, browser type, device identifiers, operating system, and usage patterns to improve our platform's performance and user experience.",
      },
      {
        heading: "Location Data",
        text: "With your permission, we may collect your precise location to help you find our service area, auto-fill your delivery address, and provide accurate delivery estimates.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        heading: "Order Processing & Delivery",
        text: "Your personal and address information is used to process your orders, assign delivery partners, and ensure your meals are delivered to the right location at the right time.",
      },
      {
        heading: "Communication",
        text: "We use your contact details to send order confirmations, delivery updates, OTPs for login, and responses to your support queries via SMS, WhatsApp, or email.",
      },
      {
        heading: "Service Improvement",
        text: "We analyse usage patterns and customer feedback to improve our menu, delivery experience, app performance, and overall service quality.",
      },
      {
        heading: "Marketing & Promotions",
        text: "With your consent, we may send you offers, discounts, and promotional updates. You can opt out of marketing communications at any time by contacting us.",
      },
      {
        heading: "Legal & Compliance",
        text: "We may use your information to comply with applicable laws, resolve disputes, enforce our agreements, and respond to lawful requests from regulatory authorities.",
      },
    ],
  },
  {
    id: "data-sharing",
    icon: Share2,
    title: "Information Sharing",
    content: [
      {
        heading: "Delivery Partners",
        text: "We share your name, contact number, and delivery address with our delivery personnel solely to fulfil your order. They are not permitted to use this information for any other purpose.",
      },
      {
        heading: "Payment Processors",
        text: "Payment-related information is shared with Razorpay to process transactions securely. Razorpay is PCI-DSS compliant and maintains its own privacy policy.",
      },
      {
        heading: "No Third-Party Selling",
        text: "We do not sell, rent, or trade your personal information to any third party for marketing or advertising purposes. Your data is yours.",
      },
      {
        heading: "Legal Disclosure",
        text: "We may disclose your information if required to do so by law, court order, or government authority, or if we believe disclosure is necessary to protect our rights or the safety of others.",
      },
    ],
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security",
    content: [
      {
        heading: "Security Measures",
        text: "We implement industry-standard security measures including SSL/TLS encryption, secure servers, and access controls to protect your personal data from unauthorised access, disclosure, or destruction.",
      },
      {
        heading: "Data Retention",
        text: "We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time.",
      },
      {
        heading: "Breach Notification",
        text: "In the unlikely event of a data breach that affects your personal information, we will notify you and the relevant authorities as required by applicable law.",
      },
      {
        heading: "Limitations",
        text: "While we take reasonable precautions, no method of electronic transmission or storage is 100% secure. We cannot guarantee the absolute security of your data.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      {
        heading: "What Are Cookies?",
        text: "Cookies are small text files stored on your device by your browser. They help us remember your preferences, keep you logged in, and understand how you use our website.",
      },
      {
        heading: "Types of Cookies We Use",
        text: "We use essential cookies (required for the website to function), functional cookies (to remember your preferences), and analytical cookies (to understand user behaviour and improve our service).",
      },
      {
        heading: "Third-Party Cookies",
        text: "We may use analytics tools such as Google Analytics that set their own cookies. These tools help us understand how users interact with our platform in aggregate, anonymous form.",
      },
      {
        heading: "Managing Cookies",
        text: "You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.",
      },
    ],
  },
  {
    id: "your-rights",
    icon: UserCheck,
    title: "Your Rights",
    content: [
      {
        heading: "Right to Access",
        text: "You have the right to request a copy of the personal information we hold about you. We will provide this within a reasonable timeframe upon verification of your identity.",
      },
      {
        heading: "Right to Correction",
        text: "If any of your personal information is inaccurate or incomplete, you may request corrections through your account settings or by contacting our support team.",
      },
      {
        heading: "Right to Deletion",
        text: "You may request the deletion of your account and associated personal data. Please note that some data may be retained for legal or operational requirements even after account deletion.",
      },
      {
        heading: "Right to Opt Out",
        text: "You can opt out of marketing communications at any time by replying 'STOP' to our messages or by emailing us at hello@readymealz.com.",
      },
      {
        heading: "Right to Withdraw Consent",
        text: "Where we rely on your consent to process your data, you have the right to withdraw that consent at any time. Withdrawal of consent will not affect the lawfulness of processing carried out before withdrawal.",
      },
    ],
  },
  {
    id: "data-deletion",
    icon: Trash2,
    title: "Data Deletion & Retention",
    content: [
      {
        heading: "Account Deletion",
        text: "You can request account deletion by contacting us via WhatsApp or email. Upon verification, we will delete your account and personal data within 7 working days.",
      },
      {
        heading: "Retained Data",
        text: "Even after account deletion, we may retain certain data such as order history and transaction records for up to 5 years as required by Indian tax and financial regulations.",
      },
      {
        heading: "Anonymised Data",
        text: "We may retain anonymised, aggregated data (with no personally identifiable information) for analytical and business improvement purposes indefinitely.",
      },
    ],
  },
  {
    id: "policy-updates",
    icon: Bell,
    title: "Policy Updates",
    content: [
      {
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make significant changes, we will notify you via SMS, email, or a prominent notice on our website.",
      },
      {
        text: "The date of the most recent revision will always be displayed at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.",
      },
      {
        text: "Your continued use of our services after any changes to this policy constitutes your acceptance of the updated terms.",
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
export default function PrivacyPolicy() {
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
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">Privacy Policy</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Shield className="w-3.5 h-3.5" />
                Privacy & Security
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Privacy <span className="text-orange-600">Policy</span>
              </h1>
              <p className="text-sm text-gray-500 max-w-xl">
                We value your trust. Learn how we collect, use, and protect
                your personal information when you use our services.
              </p>
            </div>
            <div className="flex-shrink-0 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-gray-600 mb-0.5">Last Updated</p>
              <p>May 2025</p>
            </div>
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: Lock, label: "SSL Encrypted" },
              { icon: Shield, label: "Data Protected" },
              { icon: UserCheck, label: "No Data Selling" },
              { icon: Database, label: "FSSAI Compliant" },
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
            <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800">
                  Contents
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
                        <span className={`text-[10px] font-bold ${active ? "text-orange-400" : "text-gray-400"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-orange-500" : "text-gray-400"}`} />
                        <span className="leading-tight">{s.title}</span>
                        {active && (
                          <ChevronRight className="w-3 h-3 ml-auto text-orange-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Quick contact in sidebar */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-700 mb-3">
                  Privacy Concerns?
                </p>
                <a
                  href="mailto:hello@readymealz.com"
                  className="flex items-center gap-2 text-xs text-orange-600 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  hello@readymealz.com
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
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-10 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 leading-relaxed">
                This Privacy Policy was last updated in{" "}
                <strong>May 2025</strong>. We encourage you to read it fully.
                If you have any questions or concerns, please{" "}
                <Link
                  href="/help"
                  className="font-semibold underline hover:text-orange-600"
                >
                  contact our support team
                </Link>
                .
              </p>
            </div>

            {/* All Sections */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 sm:px-8 py-8 space-y-10">
              {sections.map((section, i) => (
                <SectionBlock key={section.id} section={section} index={i} />
              ))}

              {/* Children's Privacy */}
              <div id="children" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    <span className="text-orange-500 mr-2 font-semibold text-base">10.</span>
                    Children's Privacy
                  </h2>
                </div>
                <div className="space-y-3 pl-0 sm:pl-12">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our services are not directed at children under the age of
                    13. We do not knowingly collect personal information from
                    children. If you believe a child has provided us with
                    personal information, please contact us immediately and we
                    will take steps to delete such information.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Users under the age of 18 should use our services only with
                    the involvement and consent of a parent or guardian.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Contact for Privacy ───────────────────────────────────── */}
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Privacy Questions or Requests?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                For data access, correction, or deletion requests, reach out to
                us directly.
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
                { label: "Terms & Conditions", href: "/terms" },
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