import Link from "next/link";
import {
  Scan,
  ShieldCheck,
  Users,
  AlertTriangle,
  Star,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - database queries require runtime
export const dynamic = 'force-dynamic';

const features = [
  {
    icon: Scan,
    title: "Instant Scanning",
    description: "Scan any barcode or QR code in seconds. No signup required.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Products",
    description: "Access our database of verified authentic products.",
  },
  {
    icon: Users,
    title: "Community Reports",
    description: "Join thousands reporting fake products to protect others.",
  },
  {
    icon: Star,
    title: "Merchant Ratings",
    description: "Find trusted sellers and avoid shady merchants.",
  },
];

const categories = [
  { name: "Medicine", emoji: "💊" },
  { name: "Food", emoji: "🍜" },
  { name: "Beverages", emoji: "🥤" },
  { name: "Cosmetics", emoji: "💄" },
  { name: "Alcohol", emoji: "🍷" },
];

export default async function Home() {
  // Fetch real stats from database
  const [products, reports, merchants, scans] = await Promise.all([
    prisma.product.count(),
    prisma.report.count(),
    prisma.merchant.count(),
    prisma.scan.count(),
  ]);

  const stats = [
    { value: products.toString(), label: "Products Listed" },
    { value: reports.toString(), label: "Fakes Reported" },
    { value: merchants.toString(), label: "Verified Merchants" },
    { value: scans.toString(), label: "Total Scans" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ScanIt</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/scan" className="text-gray-300 hover:text-white transition">Scan</Link>
              <Link href="/report" className="text-gray-300 hover:text-white transition">Report Fake</Link>
              <Link href="/heatmap" className="text-gray-300 hover:text-white transition">Heat Map</Link>
              <Link href="/merchants" className="text-gray-300 hover:text-white transition">Merchants</Link>
            </div>
            <Link href="/scan" className="btn-primary">
              <Scan className="w-4 h-4" />
              Start Scanning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
            <AlertTriangle className="w-4 h-4" />
            Join the fight against fake products in Nigeria
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="gradient-text">Verify</span> Before You Buy
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Protect yourself from counterfeit products. Scan any barcode to instantly
            check authenticity. No signup needed – just scan and verify.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan" className="btn-primary text-lg px-8 py-4">
              <Scan className="w-5 h-5" />
              Scan a Product
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/report" className="btn-secondary text-lg px-8 py-4">
              <AlertTriangle className="w-5 h-5" />
              Report a Fake
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="card text-center">
                <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Three simple steps to verify any product. No account required.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Scan", desc: "Point your camera at any barcode or QR code" },
              { step: "2", title: "Verify", desc: "We check against our verified product database" },
              { step: "3", title: "Decide", desc: "Get instant results and make informed purchases" },
            ].map((item, i) => (
              <div key={i} className="card text-center relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Product Categories
          </h2>
          <p className="text-gray-400 text-center mb-12">
            We cover a wide range of products commonly counterfeited in Nigeria
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="card text-center cursor-pointer group">
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <div className="font-semibold text-white group-hover:text-emerald-400 transition">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose ScanIt?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card">
                <feature.icon className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border-emerald-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Verify?
            </h2>
            <p className="text-gray-400 mb-8">
              Start protecting yourself from fake products today. It's free and instant.
            </p>
            <Link href="/scan" className="btn-primary text-lg px-8 py-4 inline-flex">
              <Scan className="w-5 h-5" />
              Scan Your First Product
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Scan className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">ScanIt</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 ScanIt. Protecting Nigerians from fake products.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
