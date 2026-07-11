"use client";

import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Package } from "lucide-react";

const statusStyle: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  cancelled: "bg-red-100 text-red-600 ring-1 ring-red-200",
  processing: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
};

export default function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        const role = Cookies.get("role");

        if (!token || role !== "customer") {
          window.location.href = "/login/customer";
          return;
        }

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

  // Called from parent (Pusher) to update a single order's status
  const updateOrderStatus = (orderId: number, status: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading orders…</p>
      </div>
    );
  }

  return (
    <div
      id="orders-section"
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">Recent Orders</h2>
          <p className="text-xs text-slate-400 mt-0.5">Your latest 5 purchases</p>
        </div>
        <Link
          href="/dashboard/customer/myorder"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-slate-50 text-left">
              {["Order ID", "Product", "Status", "Date", "Total"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-400">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No orders yet</p>
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700 text-sm">
                      #{order.id}
                    </span>
                  </td>

                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          order.orderItems?.[0]?.product?.productImage
                            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${order.orderItems[0].product.productImage}`
                            : "/no-image.png"
                        }
                        alt="Product"
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">
                          {order.orderItems?.[0]?.product?.productName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Qty: {order.orderItems?.[0]?.quantity}
                          {order.orderItems?.length > 1 &&
                            ` +${order.orderItems.length - 1} more`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize
                        ${statusStyle[order.status] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-indigo-600 text-sm">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}