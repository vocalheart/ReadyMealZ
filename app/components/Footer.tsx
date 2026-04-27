import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logoreadymealz";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Menu", href: "/menu" },
    { label: "Subscribe", href: "/subscribe" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Track Order", href: "/orders" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "hover:text-blue-600",
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:text-pink-600",
    }, 
    {
      label: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      label: "Linkedin",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:text-blue-700",
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      label: "Address",
      value: "Arera Colony, Bhopal, MP 462016",
      href: "#",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@readymealz.com",
      href: "mailto:hello@readymealz.com",
    },
  ];

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Get Fresh Meals Delivered
              </h3>
              <p className="text-sm text-gray-600">
                Subscribe to our newsletter for exclusive offers and updates
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 flex-shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <div className="w-36 sm:w-44 h-auto">
                <Image src={logo} alt="A1Meals" className="w-full h-auto" />
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Fresh, homemade tiffin service delivering happiness and quality
              meals to your doorstep in Bhopal.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-800">
                Follow Us:
              </span>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      title={social.label}
                      className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition transform hover:scale-110 hover:bg-gray-200 ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-lg">✓</span>
                <span>100% Fresh & Hygienic</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-lg">✓</span>
                <span>Same Day Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-lg">✓</span>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-orange-600 transition flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-orange-600 transition flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <li key={info.label}>
                    <a
                      href={info.href}
                      className="flex items-start gap-3 group text-sm text-gray-600 hover:text-orange-600 transition"
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-orange-600 transition" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 group-hover:text-orange-600/80 transition">
                          {info.label}
                        </span>
                        <span className="font-medium text-gray-800 group-hover:text-orange-600 transition">
                          {info.value}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 text-center">
            {[
              { value: "50,000+", label: "Meals Delivered" },
              { value: "500+", label: "Happy Customers" },
              { value: "4.8★", label: "Average Rating" },
              { value: "2 hrs", label: "Delivery Time" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-orange-300 transition shadow-sm"
              >
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 text-center sm:text-left">
            <p className="flex items-center justify-center sm:justify-start gap-1.5">
              © {currentYear} A1Meals. All rights reserved.
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline">Made with</span>
              <Heart className="w-4 h-4 text-red-500 inline" />
              <span className="hidden sm:inline">in Bhopal</span>
            </p>

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/privacy"
                className="hover:text-orange-600 transition"
              >
                Privacy
              </Link>
              <span className="hidden sm:inline text-gray-400">·</span>
              <Link
                href="/terms"
                className="hover:text-orange-600 transition"
              >
                Terms
              </Link>
              <span className="hidden sm:inline text-gray-400">·</span>
              <Link
                href="/cookies"
                className="hover:text-orange-600 transition"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}