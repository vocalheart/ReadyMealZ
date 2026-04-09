import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/Conditionallayout";
import ReduxProvider from "./redux/Provider";
import AuthLoader from "./redux/AuthLoader";
import ToastProvider from './components/ToastProvider';
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadyMealz",
  description: "Food-Subscription Platform",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <ReduxProvider>
          {/* Auto fetch user on app load */}
          <ToastProvider />
          <AuthLoader>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthLoader>
        </ReduxProvider>
      </body>
    </html>
  );
};
