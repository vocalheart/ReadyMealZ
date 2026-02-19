import Link from "next/link";

// --- SVG Icons ---
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SubscribeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BulkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

// Admin icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const PlansIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const RouteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const CustomersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const DonationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Design system icons
const ColorsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" />
    <circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c-4.97 0-9-2.24-9-5 0-2.76 4.03-5 9-5s9 2.24 9 5" />
  </svg>
);

const TypographyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const SpacingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" />
  </svg>
);

const ComponentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" /><rect x="3" y="13" width="8" height="8" />
  </svg>
);

const ResponsiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const AccessibleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
  </svg>
);

// --- Feature Card ---
type FeatureCard = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  href: string;
};

function Card({ card }: { card: FeatureCard }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${card.iconBg}`}>
          {card.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">{card.title}</h3>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{card.desc}</p>
        </div>
      </div>
      <a
        href={card.href}
        className="mt-auto w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition text-center flex items-center justify-center gap-1"
      >
        View Page <ArrowRightIcon />
      </a>
    </div>
  );
}

// --- Data ---
const customerFeatures: FeatureCard[] = [
  {
    icon: <HomeIcon />,
    iconBg: "bg-blue-500",
    title: "Home",
    desc: "Hero section, subscription plans, today's menu with lunch/dinner tabs, category grid, and bulk order banner",
    href: "/",
  },
  {
    icon: <SubscribeIcon />,
    iconBg: "bg-purple-500",
    title: "Subscribe",
    desc: "5-step stepper flow: Plan → Timing → Start Date → Address → Payment with real-time calculation",
    href: "/subscribe",
  },
  {
    icon: <MenuIcon />,
    iconBg: "bg-green-500",
    title: "Menu",
    desc: "Browse all items with search, filters (category, veg/non-veg, tags), sidebar for desktop, bottom sheet for mobile",
    href: "/menu",
  },
  {
    icon: <CartIcon />,
    iconBg: "bg-orange-500",
    title: "Cart",
    desc: "Shopping cart with quantity controls, coupon codes, bill summary, and checkout button",
    href: "/cart",
  },
  {
    icon: <CheckoutIcon />,
    iconBg: "bg-pink-500",
    title: "Checkout",
    desc: "Address selection, time slot, special instructions, payment methods, and order success confirmation",
    href: "/checkout",
  },
  {
    icon: <AccountIcon />,
    iconBg: "bg-indigo-500",
    title: "Account",
    desc: "Dashboard with tabs: Subscriptions (pause/skip/donate), Orders, Wallet, Addresses, Profile",
    href: "/account",
  },
  {
    icon: <BulkIcon />,
    iconBg: "bg-yellow-500",
    title: "Bulk Order",
    desc: "Silver/Gold/Premium packages for events, quote request form, and confirmation",
    href: "/bulk-orders",
  },
  {
    icon: <WalletIcon />,
    iconBg: "bg-teal-500",
    title: "Wallet",
    desc: "Balance display, add money dialog with quick amounts, transaction history",
    href: "/wallet",
  },
];

const adminFeatures: FeatureCard[] = [
  {
    icon: <DashboardIcon />,
    iconBg: "bg-red-500",
    title: "Dashboard",
    desc: "Key metrics, growth indicators, revenue charts, order distribution, recent orders table",
    href: "/admin/dashboard",
  },
  {
    icon: <PlansIcon />,
    iconBg: "bg-blue-500",
    title: "Plans",
    desc: "Manage subscription plans, pricing, savings, and popular badges",
    href: "/admin/plans",
  },
  {
    icon: <CalendarIcon />,
    iconBg: "bg-green-500",
    title: "Menu Calendar",
    desc: "Set lunch and dinner menus for each day, week navigation, visual preview",
    href: "/admin/menu-calendar",
  },
  {
    icon: <OrdersIcon />,
    iconBg: "bg-orange-500",
    title: "Orders",
    desc: "View and manage all orders (one-time, subscription, bulk) with status filters",
    href: "/admin/orders",
  },
  {
    icon: <RouteIcon />,
    iconBg: "bg-purple-500",
    title: "Route Optimization",
    desc: "Optimize delivery routes by date and slot, rider assignment, distance and time calculation",
    href: "/admin/routes",
  },
  {
    icon: <CustomersIcon />,
    iconBg: "bg-pink-500",
    title: "Customers",
    desc: "Customer management, subscription status, pause/resume controls",
    href: "/admin/customers",
  },
  {
    icon: <DonationsIcon />,
    iconBg: "bg-yellow-500",
    title: "Donations",
    desc: "Track donated meals, beneficiary information, donation reports",
    href: "/admin/donations",
  },
  {
    icon: <SettingsIcon />,
    iconBg: "bg-gray-500",
    title: "Settings",
    desc: "Platform configuration, pricing updates, notification settings",
    href: "/admin/settings",
  },
];

const designItems = [
  { icon: <ColorsIcon />, title: "Colors", desc: "Primary Orange (#F97316), consistent with modern food delivery apps" },
  { icon: <TypographyIcon />, title: "Typography", desc: "Inter font family, 36/28/20/15/13px scale" },
  { icon: <SpacingIcon />, title: "Spacing", desc: "8-point grid system for consistency" },
  { icon: <ComponentsIcon />, title: "Components", desc: "Radix UI primitives with custom theming" },
  { icon: <ResponsiveIcon />, title: "Responsive", desc: "Mobile-first with 375/768/1440px breakpoints" },
  { icon: <AccessibleIcon />, title: "Accessible", desc: "ARIA labels, keyboard navigation, screen reader support" },
];

// --- Page ---
export default function FeaturesPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="py-16 px-4 text-center">
        <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          Platform Overview
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Complete Food Tiffin Platform
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
          A production-ready mobile-first subscription and ordering platform built with React,
          TypeScript, and Tailwind CSS. Featuring comprehensive customer and admin interfaces.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-10">
          {[
            { value: "16+", label: "Screens" },
            { value: "100%", label: "Mobile Responsive" },
            { value: "50+", label: "UI Components" },
            { value: "Ready", label: "For Production" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 py-5 px-4">
              <div className="text-2xl font-bold text-orange-500">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER FEATURES */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {customerFeatures.map((c) => <Card key={c.title} card={c} />)}
          </div>
        </div>
      </section>

      {/* ADMIN FEATURES */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {adminFeatures.map((a) => <Card key={a.title} card={a} />)}
          </div>
        </div>
      </section>

      {/* DESIGN SYSTEM */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Design System Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designItems.map((d) => (
                <div key={d.title}>
                  <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                    <span className="text-gray-500">{d.icon}</span>
                    {d.title}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Explore?</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2"
          >
            Customer Experience <ArrowRightIcon />
          </Link>
          <Link
            href="/admin/dashboard"
            className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
          >
            Admin Dashboard <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </main>
  );
}