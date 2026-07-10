"use client";

import CartPage from "@/components/CartPage";
import RecentOrders from "@/components/RecentOrders";
import axios from "axios";
import Cookies from "js-cookie";
import Pusher from "pusher-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  ShoppingCart,
  Package,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  ChevronRight,
} from "lucide-react";

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "cart" | "orders">("overview");

  useEffect(() => {
    const pusher = new Pusher("8ce8e1219e4b306f5eba", { cluster: "ap2" });
    const channel = pusher.subscribe("order-channel");

    channel.bind("order-status-updated", (data: any) => {
      console.log("Realtime Update:", data);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      );
      toast.success(`Order #${data.orderId} is now ${data.status}`);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "customer") {
      window.location.href = "/login/customer";
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    axios
      .get("http://localhost:3000/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(console.log);

    axios
      .get(`http://localhost:3000/customer/my-orders/${payload.sub}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(console.log);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/login/customer";
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  ];

  const navItems = [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "cart",     label: "My Cart",  icon: ShoppingCart },
    { key: "orders",   label: "Orders",   icon: Package },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f4f6fb]">

      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex-col z-30 shadow-sm hidden lg:flex">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShoppingCart size={16} className="text-white" />
            </div>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">ShopZone</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilePic ? `http://localhost:3000/uploads/profile/${user.profilePic}` : "/no-image.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
            />
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{user?.name ?? "—"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${activeTab === key
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <Icon size={17} /> {label}
            </button>
          ))}

          <Link
            href="/dashboard/customer/profile"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <User size={17} /> Profile
          </Link>

          <Link
            href="/dashboard/customer/myorder"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <Package size={17} /> All Orders
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="lg:pl-64">

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">
              {navItems.find((n) => n.key === activeTab)?.label ?? "Dashboard"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile tabs */}
            <div className="flex lg:hidden items-center gap-1">
              {navItems.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${activeTab === key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button className="relative p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
              <Bell size={18} />
              {orders.filter((o) => o.status === "pending").length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <img
              src={user?.profilePic ? `http://localhost:3000/uploads/profile/${user.profilePic}` : "/no-image.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
            />
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 max-w-6xl mx-auto">

          {/* ── Cart Tab ── */}
          {activeTab === "cart" && <CartPage />}

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && <RecentOrders />}

          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-white rounded-2xl border ${stat.border} p-5 flex items-center gap-4 shadow-sm`}
                  >
                    <div className={`${stat.bg} p-3 rounded-xl`}>
                      <stat.icon size={22} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                      <p className={`text-3xl font-extrabold mt-0.5 ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative shrink-0">
                  <img
                    src={user?.profilePic ? `http://localhost:3000/uploads/profile/${user.profilePic}` : "/no-image.png"}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold text-slate-800">{user?.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                    <Link
                      href="/dashboard/customer/profile"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
                    >
                      <User size={14} /> Edit Profile
                    </Link>
                    <button
                      onClick={() => setActiveTab("cart")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition"
                    >
                      <ShoppingCart size={14} /> View Cart
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition"
                    >
                      <Package size={14} /> My Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders preview */}
              <RecentOrders />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab("orders")}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  See all orders <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}