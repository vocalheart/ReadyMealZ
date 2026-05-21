"use client";

import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

// ── Quick reply suggestions ───────────────────────────────────────────────────
const quickReplies = [
  "📋 View Menu",
  "🚚 Track my order",
  "💰 Pricing & Plans",
  "⏰ Delivery timings",
  "📞 Contact support",
];

// ── Bot response logic ────────────────────────────────────────────────────────
const getBotResponse = (msg: string): string => {
  const m = msg.toLowerCase();

  if (m.includes("menu") || m.includes("food") || m.includes("meal") || m.includes("khana") || m.includes("tiffin"))
    return "🍱 Our menu includes fresh home-cooked meals like Dal Tadka, Paneer Butter Masala, Rajma Rice, Veg Thali and more! We update the menu daily. Visit /menu to see today's options. 😊";

  if (m.includes("price") || m.includes("cost") || m.includes("rate") || m.includes("kitna") || m.includes("charge"))
    return "💰 Our meals start from just ₹99! A full Veg Thali is ₹199. Bulk orders and weekly subscriptions come with special discounts. Free delivery on orders above ₹299! 🎉";

  if (m.includes("delivery") || m.includes("time") || m.includes("timing") || m.includes("kab"))
    return "⏰ We deliver Lunch between 12 PM – 2 PM and Dinner between 7 PM – 9 PM, 7 days a week — including Sundays & holidays! 🚴";

  if (m.includes("track") || m.includes("order") || m.includes("status") || m.includes("where"))
    return "📍 You can track your order in real-time from the 'My Orders' section after logging in. You'll also get an SMS when your order is out for delivery!";

  if (m.includes("cancel") || m.includes("refund") || m.includes("return"))
    return "↩️ You can cancel your order up to 2 hours before delivery for a full refund. For issues, contact us on WhatsApp at +91 96303 02626 with your order ID.";

  if (m.includes("area") || m.includes("location") || m.includes("bhopal") || m.includes("deliver") || m.includes("pincode"))
    return "📍 We currently deliver across Bhopal — Arera Colony, MP Nagar, Kolar Road, Govind Garden, TT Nagar and more! Enter your pincode on our menu page to check availability.";

  if (m.includes("bulk") || m.includes("office") || m.includes("event") || m.includes("party"))
    return "📦 We do bulk orders for offices, events and parties! Place your bulk order at least 48 hours in advance. Visit /bulk-orders or call +91 96303 02626 for special pricing.";

  if (m.includes("subscription") || m.includes("monthly") || m.includes("weekly") || m.includes("plan"))
    return "📅 We offer weekly & monthly subscription plans with exciting discounts! Subscribe and enjoy fresh meals every day without the hassle of ordering each time. 🙌";

  if (m.includes("contact") || m.includes("support") || m.includes("help") || m.includes("phone") || m.includes("whatsapp"))
    return "📞 Reach us anytime!\n📱 WhatsApp: +91 96303 02626\n📧 Email: hello@readymealz.com\n⏰ Support: 9 AM – 9 PM, 7 days a week";

  if (m.includes("hi") || m.includes("hello") || m.includes("hey") || m.includes("hii") || m.includes("namaste"))
    return "👋 Hello! Welcome to ReadyMealz! I'm here to help you with our menu, pricing, delivery, orders and more. What can I assist you with today?";

  if (m.includes("thank") || m.includes("thanks") || m.includes("shukriya"))
    return "😊 You're most welcome! Feel free to ask anything anytime. Enjoy your meal! 🍱";

  return "🤔 I didn't quite catch that! You can ask me about our menu, pricing, delivery timings, order tracking, or contact support. How can I help? 😊";
};

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// ── Welcome Toast ─────────────────────────────────────────────────────────────
function WelcomeToast({ onOpen, onClose }: { onOpen: () => void; onClose: () => void }) {
  return (
    <div className="fixed bottom-24 right-5 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-4 w-[280px] sm:w-[300px]">
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>

        {/* Bot avatar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-lg">🍱</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">ReadyMealz Support</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Online now</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          👋 <strong>Welcome to ReadyMealz!</strong> Fresh homemade tiffins delivered to your door. 🍛
        </p>
        <p className="text-xs text-gray-500 mb-4">Hungry? Ask me about today's menu, pricing or delivery!</p>

        <button
          onClick={() => { onClose(); onOpen(); }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Order your meal now 🚀
        </button>
      </div>
    </div>
  );
}

// ── Main ChatBot ──────────────────────────────────────────────────────────────
const GlobalChatBot = () => {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "👋 Hello! Welcome to ReadyMealz!\n\nI'm your meal assistant. Ask me about our menu, delivery, pricing, or orders. How can I help you today? 😊",
      time: getTime(),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show toast after 3s on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem("rm_toast_seen");
    if (!seen) {
      const t = setTimeout(() => setShowToast(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismissToast = () => {
    setShowToast(false);
    sessionStorage.setItem("rm_toast_seen", "1");
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = (text?: string) => {
    const msgText = (text ?? input).trim();
    if (!msgText) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: msgText, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: getBotResponse(msgText),
        time: getTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 900 + Math.random() * 500);
  };

  return (
    <>
      {/* ── Welcome Toast ── */}
      {showToast && !open && (
        <WelcomeToast onOpen={() => setOpen(true)} onClose={dismissToast} />
      )}

      {/* ── Chat Window ── */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-5 w-[calc(100vw-2rem)] sm:w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl z-50 border border-orange-100 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🍱
              </div>
              <div>
                <p className="text-sm font-bold text-white">ReadyMealz Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-xs text-orange-100">Online · Typically replies instantly</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-orange-500" />
                  </div>
                )}
                <div className={`max-w-[80%] group`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "bot"
                        ? "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                        : "bg-orange-500 text-white rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-orange-500" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-gray-50 text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 rounded-xl flex items-center justify-center transition flex-shrink-0"
            >
              {typing ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => { setOpen(!open); dismissToast(); }}
        className={`fixed bottom-5 right-4 sm:right-5 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          open
            ? "bg-gray-700 hover:bg-gray-800 rotate-90"
            : "bg-orange-500 hover:bg-orange-600 hover:scale-110 hover:shadow-orange-200 hover:shadow-xl"
        }`}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Unread dot */}
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
          </>
        )}
      </button>
    </>
  );
};

export default GlobalChatBot;