"use client"

import { useState } from "react"
import { PauseCircle, SkipForward, Gift, Pencil, Clock3, Calendar, MapPin, Trash2, Plus,User,CreditCard,ShoppingBag,Home,Wallet,} from "lucide-react"

type Tab = "subscriptions" | "orders" | "wallet" | "addresses" | "profile"

// ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────
function SubscriptionsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Active Subscription */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Active Subscription</h2>
            <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              active
            </span>
          </div>
          <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            Manage Plan
          </button>
        </div>

        {/* Plan Info — stacks on mobile */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4 border-t border-gray-100">
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Plan</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">7 Days</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Meals Left</p>
            <p className="text-sm sm:text-base font-semibold text-orange-500 mt-1">4</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Next Delivery</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">Feb 19, 2026</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-2">
          {/* Time & Meal Type */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400">Time Slot</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900 ml-1">12:00 PM - 1:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400">Meal Type</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900 ml-1">Lunch</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {[
              { icon: <PauseCircle className="w-4 h-4" />, label: "Pause Subscription" },
              { icon: <SkipForward className="w-4 h-4" />, label: "Skip Tomorrow" },
              { icon: <Gift className="w-4 h-4" />, label: "Donate Next Meal" },
              { icon: <Pencil className="w-4 h-4" />, label: "Change Timing" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Subscription History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Subscription History</h2>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-4">
          <div>
            <p className="text-sm font-medium text-gray-800">7 Days Plan - Lunch</p>
            <p className="text-xs text-gray-400 mt-0.5">Feb 10 - Feb 17, 2026</p>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-3">Completed</span>
        </div>
      </div>
    </div>
  )
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
function OrdersTab() {
  const orders = [
    {
      id: "ORD-001",
      date: "Feb 15, 2026 · 05:30 AM",
      status: "delivered",
      statusColor: "bg-green-500",
      items: [{ name: "Butter Chicken with Naan (Regular) x1", price: 180 }],
      address: "Home",
      total: 180,
      showTrack: false,
    },
    {
      id: "ORD-002",
      date: "Feb 18, 2026 · 05:30 AM",
      status: "out-for-delivery",
      statusColor: "bg-orange-400",
      items: [{ name: "Chicken Biryani (Half) x1", price: 200 }],
      address: "Home",
      total: 230,
      showTrack: true,
    },
  ]

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-900">Order #{order.id}</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{order.date}</p>
            </div>
            <span className={`px-2.5 py-1 ${order.statusColor} text-white text-xs font-medium rounded-full whitespace-nowrap ml-3`}>
              {order.status}
            </span>
          </div>

          {order.items.map((item) => (
            <div key={item.name} className="flex justify-between items-center py-3 border-t border-gray-100 gap-2">
              <span className="text-xs sm:text-sm text-gray-700">{item.name}</span>
              <span className="text-xs sm:text-sm text-gray-700 shrink-0">₹{item.price}</span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-xs sm:text-sm">{order.address}</span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-orange-500">₹{order.total}</span>
          </div>

          {order.showTrack && (
            <button className="w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
              Track Order
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── WALLET ──────────────────────────────────────────────────────────────────
function WalletTab() {
  const transactions = [
    { label: "Added to wallet", date: "Feb 10, 2026", amount: "+₹500", color: "text-green-500" },
    { label: "Order #ORD-001", date: "Feb 15, 2026", amount: "-₹180", color: "text-red-500" },
    { label: "Referral bonus", date: "Feb 16, 2026", amount: "+₹50", color: "text-green-500" },
    { label: "Order #ORD-002", date: "Feb 18, 2026", amount: "-₹230", color: "text-red-500" },
  ]
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
        <p className="text-sm text-gray-400">Wallet Balance</p>
        <p className="text-3xl sm:text-4xl font-bold text-orange-500 mt-2">₹140</p>
        <button className="mt-4 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Money
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-1">
          {transactions.map((tx, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 gap-4">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{tx.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
              </div>
              <span className={`text-sm font-semibold shrink-0 ${tx.color}`}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ADDRESSES ───────────────────────────────────────────────────────────────
function AddressesTab() {
  const addresses = [
    {
      label: "Home",
      isDefault: true,
      line1: "42, Arera Colony, Near Habibganj Railway Station, Bhopal, 462016",
      landmark: "Near SBI Bank",
      phone: "+91 98765 43210",
    },
    {
      label: "Office",
      isDefault: false,
      line1: "12, MP Nagar, Zone 2, Bhopal, 462011",
      landmark: "Opposite DB Mall",
      phone: "+91 98765 43210",
    },
  ]

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div key={addr.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-semibold text-gray-900">{addr.label}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-500">Default</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">{addr.line1}</p>
              <p className="text-xs sm:text-sm text-gray-500">Landmark: {addr.landmark}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{addr.phone}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button className="w-full py-4 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add New Address
      </button>
    </div>
  )
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 sm:mb-6">Personal Information</h2>
      <div className="space-y-4">
        {/* First + Last Name: stack on mobile, side-by-side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm text-gray-500 mb-1">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-orange-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-500 mb-1">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-orange-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-gray-500 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>
        <button className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors text-sm">
          Save Changes
        </button>
      </div>
    </div>
  )
}

// ─── TAB CONFIG ──────────────────────────────────────────────────────────────
const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "subscriptions", label: "Subscriptions", icon: <CreditCard className="w-4 h-4" /> },
  { key: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { key: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
  { key: "addresses", label: "Addresses", icon: <Home className="w-4 h-4" /> },
  { key: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
]

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("subscriptions")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Account</h1>

        {/* ── Desktop / Tablet Tab Bar (hidden on mobile) ── */}
        <div className="hidden sm:flex bg-gray-100 rounded-2xl p-1 mb-6 sm:mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap px-2 ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "subscriptions" && <SubscriptionsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "wallet" && <WalletTab />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.key ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className={activeTab === tab.key ? "text-orange-500" : "text-gray-400"}>
                {tab.icon}
              </span>
              <span className="leading-none">
                {tab.key === "subscriptions" ? "Plans" : tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}