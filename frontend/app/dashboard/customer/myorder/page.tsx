"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Package,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  Filter,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700 ring-1 ring-blue-200", icon: Truck },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600 ring-1 ring-red-200", icon: XCircle },
};

const paymentIcons: Record<string, string> = {
  cash: "💵",
  bkash: "📱",
  nagad: "🔴",
  card: "💳",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) { window.location.href = "/login/customer"; return; }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const customerId = payload.sub;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/my-orders/${customerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = [
    { label: "Total", value: orders.length, color: "text-slate-800", bg: "bg-slate-100" },
    { label: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length, color: "text-red-600", bg: "bg-red-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-semibold">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/dashboard/customer"
            className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm"
          >
            <ArrowLeft size={18} />
          </a>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">My Orders</h1>
            <p className="text-slate-400 text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl px-4 py-3 flex flex-col`}>
              <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
              <span className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {["all", "pending", "processing", "delivered", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all
                ${filter === f
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center gap-4">
            <div className="bg-indigo-50 p-6 rounded-full">
              <ShoppingBag size={40} className="text-indigo-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-700">No orders found</h2>
            <p className="text-slate-400 text-sm">
              {filter === "all" ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            </p>
            <a
              href="/dashboard/customer/cart"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig["pending"];
              const StatusIcon = status.icon;
              const isOpen = expandedId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
                >
                  {/* ── Order header (always visible) ── */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                    className="w-full text-left px-6 py-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Left: ID + date + payment */}
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-3 rounded-xl">
                        <Package size={20} className="text-indigo-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-800 text-base">Order #{order.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                            <StatusIcon size={11} /> {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <CreditCard size={11} />
                            {paymentIcons[order.paymentMethod] ?? "💰"} {order.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: total + toggle */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium">Total</p>
                        <p className="text-lg font-extrabold text-indigo-600">
                          ${Number(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </button>

                  {/* ── Order items (expandable) ── */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                      {/* Progress bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>On the Way</span>
                          <span>Delivered</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{
                              width:
                                order.status === "pending" ? "10%" :
                                  order.status === "processing" ? "45%" :
                                    order.status === "delivered" ? "100%" :
                                      order.status === "cancelled" ? "0%" : "10%",
                              background: order.status === "cancelled" ? "#ef4444" : undefined,
                            }}
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex flex-col gap-3">
                        {order.orderItems.map((item: any) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-4"
                          >
                            <img
                              src={
                                item.product?.productImage
                                  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.productImage}`
                                  : "/no-image.png"
                              }
                              alt={item.product?.productName}
                              className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">
                                {item.product?.productName}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-extrabold text-indigo-600 text-sm shrink-0">
                              ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer summary */}
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-xs text-slate-400 font-medium">
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 font-medium">Order total:</span>
                          <span className="text-base font-extrabold text-indigo-600">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}