"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag, MapPin, Star, Users, Package, Truck,
  Shield, Leaf, ArrowRight, CheckCircle, Store,
  Smartphone, Dumbbell, Shirt, Home, Sparkles, Watch,
  ChevronRight, Heart, Award, Clock, Headphones,
} from "lucide-react";

const stats = [
  { value: "500+",  label: "Products",         icon: Package },
  { value: "50K+",  label: "Happy Customers",  icon: Users   },
  { value: "3+",    label: "Trusted Sellers",  icon: Store   },
  { value: "98%",   label: "Satisfaction",     icon: Star    },
];

const categories = [
  { name: "Electronics",   icon: Smartphone, count: 4,  color: "bg-indigo-50 text-indigo-600 border-indigo-100",  emoji: "📱" },
  { name: "Sports",        icon: Dumbbell,   count: 3,  color: "bg-emerald-50 text-emerald-600 border-emerald-100", emoji: "⚽" },
  { name: "Beauty",        icon: Sparkles,   count: 4,  color: "bg-pink-50 text-pink-600 border-pink-100",        emoji: "✨" },
  { name: "Fashion",       icon: Shirt,      count: 3,  color: "bg-amber-50 text-amber-600 border-amber-100",     emoji: "👕" },
  { name: "Home & Living", icon: Home,       count: 3,  color: "bg-teal-50 text-teal-600 border-teal-100",        emoji: "🏠" },
  { name: "Smartwatch",    icon: Watch,      count: 2,  color: "bg-purple-50 text-purple-600 border-purple-100",  emoji: "⌚" },
];

const sellers = [
  {
    name:     "STAR TECH",
    location: "Dhaka, Bangladesh",
    badge:    "Top Seller",
    badgeColor: "bg-amber-100 text-amber-700",
    products: ["Smartwatch", "Facewash", "Electronics"],
    rating:   4.9,
    since:    "2021",
    initials: "ST",
    color:    "bg-indigo-600",
    desc:     "One of Bangladesh's most trusted tech & lifestyle retailers, offering premium electronics and beauty products at competitive prices.",
  },
  {
    name:     "TECHLAND-BD Store",
    location: "Dhaka, Bangladesh",
    badge:    "Verified",
    badgeColor: "bg-emerald-100 text-emerald-700",
    products: ["Sports", "Beauty", "Home & Living", "Fashion"],
    rating:   4.8,
    since:    "2020",
    initials: "TL",
    color:    "bg-emerald-600",
    desc:     "Your go-to destination for sports gear, beauty essentials, home decor, and fashion — all under one roof with guaranteed quality.",
  },
  {
    name:     "PCB-BD Store",
    location: "Dhaka, Bangladesh",
    badge:    "Certified",
    badgeColor: "bg-blue-100 text-blue-700",
    products: ["Electronics", "Fashion", "Home & Living"],
    rating:   4.7,
    since:    "2022",
    initials: "PCB",
    color:    "bg-blue-600",
    desc:     "Specialist in cutting-edge electronics and modern lifestyle products, bringing the latest gadgets and trends to Bangladesh.",
  },
];

const featured = [
  { name: "Smart Watch Pro",           price: "৳4,200", category: "Electronics", seller: "PCB-BD Store",      emoji: "⌚", tag: "Best Seller" },
  { name: "Wireless Headphones",       price: "৳3,500", category: "Electronics", seller: "PCB-BD Store",      emoji: "🎧", tag: "New Arrival" },
  { name: "Dumbbell Set 10KG",         price: "৳2,900", category: "Sports",      seller: "TECHLAND-BD Store", emoji: "🏋️", tag: "Popular"     },
  { name: "Premium Perfume Bottle",    price: "৳3,500", category: "Beauty",      seller: "TECHLAND-BD Store", emoji: "🌸", tag: "Top Rated"   },
  { name: "Men Casual Sneakers",       price: "৳3,200", category: "Fashion",     seller: "PCB-BD Store",      emoji: "👟", tag: "Trending"    },
  { name: "Football Training Ball",    price: "৳1,600", category: "Sports",      seller: "TECHLAND-BD Store", emoji: "⚽", tag: "Popular"     },
];

const values = [
  { icon: Shield,  title: "Quality Assured",   desc: "Every product is verified by our team before listing. No fakes, no compromises.",         color: "bg-indigo-50 text-indigo-600" },
  { icon: Truck,   title: "Fast Delivery",     desc: "We deliver across Dhaka and beyond. Same-day and next-day delivery available.",           color: "bg-emerald-50 text-emerald-600" },
  { icon: Heart,   title: "Customer First",    desc: "Our 24/7 support team is always ready to help. Your satisfaction is our top priority.",    color: "bg-rose-50 text-rose-600" },
  { icon: Leaf,    title: "Ethical Sourcing",  desc: "We work only with sellers who meet our standards for fair pricing and honest listings.",    color: "bg-teal-50 text-teal-600" },
  { icon: Award,   title: "Best Prices",       desc: "Competitive pricing across all categories. We price-match and run regular deals.",         color: "bg-amber-50 text-amber-600" },
  { icon: Clock,   title: "Easy Returns",      desc: "Not satisfied? Return within 7 days. No long forms, no hassle — just a simple process.",   color: "bg-purple-50 text-purple-600" },
];

const tagColors: Record<string, string> = {
  "Best Seller":  "bg-amber-100 text-amber-700",
  "New Arrival":  "bg-indigo-100 text-indigo-700",
  "Popular":      "bg-emerald-100 text-emerald-700",
  "Top Rated":    "bg-rose-100 text-rose-700",
  "Trending":     "bg-purple-100 text-purple-700",
};

export default function AboutPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? featured
      : featured.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-24 px-6">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glow blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <MapPin size={14} className="text-indigo-300" />
            Proudly serving Dhaka, Bangladesh
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            About <span className="text-indigo-400">NexCart</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Bangladesh fastest-growing online marketplace — connecting trusted local sellers
            with thousands of happy shoppers across Electronics, Fashion, Sports, Beauty, and more.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-900/50"
            >
              Browse Products <ArrowRight size={16} />
            </Link>
            <Link
              href="/register/customer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-indigo-600 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <s.icon size={22} className="mx-auto mb-2 text-indigo-200" />
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-indigo-200 text-sm font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Built for Bangladesh, <br />by Bangladeshis
            </h2>
            <p className="text-slate-500 mt-5 leading-relaxed">
              NexCart started with a simple idea — make online shopping in Bangladesh easier, safer, and more affordable. We saw that customers struggled to find trusted sellers, and small businesses struggled to reach buyers online.
            </p>
            <p className="text-slate-500 mt-4 leading-relaxed">
              So we built a platform that bridges that gap. Today we host verified sellers across Dhaka offering everything from smartphones and smartwatches to football kits, perfumes, and home decor — all at honest prices.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              {[
                "Verified sellers only — no unverified listings",
                "All products in BDT (Bangladeshi Taka)",
                "Cash on delivery + bKash + Nagad + Card",
                "Covering all of Dhaka with fast delivery",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                  <CheckCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Visual grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { e: "🛍️", t: "Multi-category",  d: "6+ product categories" },
              { e: "🏪", t: "Local Sellers",   d: "All based in Dhaka"    },
              { e: "💳", t: "Easy Payment",    d: "4 payment methods"      },
              { e: "🚚", t: "Fast Shipping",   d: "Same-day available"     },
            ].map((c) => (
              <div key={c.t} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="text-3xl mb-3">{c.e}</div>
                <p className="font-bold text-slate-800 text-sm">{c.t}</p>
                <p className="text-slate-400 text-xs mt-1">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">What We Sell</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Shop by Category</h2>
            <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto">
              From gadgets to gym gear — we carry everything you need for modern life in Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={`border ${cat.color} rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <p className="font-bold text-sm">{cat.name}</p>
                  <p className="text-xs opacity-60 mt-0.5">{cat.count} products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">What's Available</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
            <p className="text-slate-400 mt-3 text-sm">A glimpse of what our sellers offer — real products, real prices.</p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {["All", "Electronics", "Sports", "Beauty", "Fashion"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveCategory(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all
                  ${activeCategory === f
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.name}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden"
              >
                {/* Product image placeholder */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 h-36 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {p.emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColors[p.tag]}`}>{p.tag}</span>
                    <span className="text-xs text-slate-400 font-medium">{p.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mt-1 leading-tight">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Store size={11} /> {p.seller}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-extrabold text-indigo-600 text-base">{p.price}</span>
                    <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">In Stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              See All Products <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── OUR SELLERS ─── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Who Sells Here</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Our Trusted Sellers</h2>
            <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto">
              Every seller on NexCart is manually verified. We check their products, pricing, and service quality before they go live.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {sellers.map((seller) => (
              <div
                key={seller.name}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-start gap-5"
              >
                {/* Avatar */}
                <div className={`${seller.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0`}>
                  {seller.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-slate-800 text-base">{seller.name}</h3>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${seller.badgeColor}`}>
                      {seller.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin size={11} /> {seller.location}
                    <span className="mx-1">·</span>
                    <Star size={11} className="text-amber-400" />
                    <span className="font-semibold text-slate-600">{seller.rating}</span>
                    <span className="mx-1">·</span>
                    Since {seller.since}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{seller.desc}</p>

                  {/* Category tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {seller.products.map((p) => (
                      <span key={p} className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating block */}
                <div className="text-center shrink-0 hidden sm:block">
                  <p className="text-3xl font-extrabold text-slate-800">{seller.rating}</p>
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={12} className={i <= Math.floor(seller.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Rating</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/sellers"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              View All Sellers <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Our Promises to You</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`${v.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">{v.title}</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATION BANNER ─── */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
              <MapPin size={16} /> Based in Dhaka, Bangladesh
            </div>
            <h2 className="text-2xl font-extrabold">Serving customers across Dhaka</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-md">
              All our sellers are located in Dhaka. We offer fast local delivery with multiple payment options including bKash, Nagad, and Cash on Delivery.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              {["Cash on Delivery 💵", "bKash 📱", "Nagad 🔴", "Card 💳"].map((m) => (
                <span key={m} className="bg-white/10 border border-white/10 text-sm font-semibold px-3 py-1.5 rounded-xl">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center min-w-[200px]">
            <p className="text-4xl font-extrabold text-indigo-400">2 hrs</p>
            <p className="text-slate-400 text-sm mt-1">Avg. delivery time</p>
            <div className="border-t border-white/10 my-4" />
            <p className="text-2xl font-extrabold text-emerald-400">Free</p>
            <p className="text-slate-400 text-sm mt-1">On orders over ৳1,000</p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <ShoppingBag size={40} className="mx-auto mb-5 text-indigo-200" />
          <h2 className="text-3xl font-extrabold">Ready to start shopping?</h2>
          <p className="text-indigo-200 mt-3 leading-relaxed">
            Join thousands of Bangladeshi shoppers getting great deals on electronics, fashion, sports gear, and more — all delivered to your door.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/register/customer"
              className="flex items-center gap-2 bg-white text-indigo-700 font-extrabold px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition shadow-lg"
            >
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}