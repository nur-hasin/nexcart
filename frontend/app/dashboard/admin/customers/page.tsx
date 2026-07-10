"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader2, Search, Users, ShoppingCart, BadgeDollarSign, Clock } from "lucide-react";
import { toast } from "react-toastify";

interface Customer {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderStatus: string;
}

const authHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");   // input value
  const [searchTerm, setSearchTerm] = useState("");   // committed search

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3000/customer/orders-details",
        authHeader(),
      );
      const orders = Array.isArray(res.data) ? res.data : [];

      // Aggregate per customer
      const customerMap = new Map<number, Customer>();

      orders.forEach((order: any) => {
        if (!order.customer) return;

        const cid = order.customer.id;
        const existing = customerMap.get(cid);

        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += Number(order.totalAmount ?? 0);
          existing.lastOrderStatus = order.status; // latest order overwrites (orders sorted DESC)
        } else {
          customerMap.set(cid, {
            id: order.customer.id,
            name: order.customer.name,
            email: order.customer.email,
            createdAt: order.createdAt,
            orderCount: 1,
            totalSpent: Number(order.totalAmount ?? 0),
            lastOrderStatus: order.status,
          });
        }
      });

      // Global stats
      setTotalOrders(orders.length);
      setTotalRevenue(
        orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount ?? 0), 0),
      );
      setPendingOrders(
        orders.filter((o: any) => o.status === "pending").length,
      );
      const sortedCustomers = Array.from(customerMap.values()).sort(
        (a, b) => a.id - b.id,
      );

      setCustomers(sortedCustomers);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to load customers");
      } else {
        toast.error("Failed to load customers");
      }
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = searchTerm.trim()
    ? customers.filter((c) => {
      const search = searchTerm.toLowerCase().trim();
      const nameWords = c.name?.toLowerCase().split(" ") ?? [];
      const emailWords = c.email?.toLowerCase().split(/[@.]/) ?? [];
      return (
        nameWords.some((w) => w === search) ||
        emailWords.some((w) => w === search) ||
        c.email?.toLowerCase() === search ||
        String(c.id) === search
      );
    })
    : customers;

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    partial: "bg-orange-100 text-orange-700",
    rider_assigned: "bg-purple-100 text-purple-700",
    out_for_delivery: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1f16]">Customers</h1>
        <p className="mt-1 text-sm text-[#7a8a6a]">
          All customers derived from order history
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-4 gap-5">
        {[
          {
            label: "Total Customers",
            value: customers.length,
            icon: Users,
            color: "bg-[#4a7c59]",
          },
          {
            label: "Total Orders",
            value: totalOrders,
            icon: ShoppingCart,
            color: "bg-blue-500",
          },
          {
            label: "Gross Order Value",
            value: `৳${totalRevenue.toLocaleString()}`,
            icon: BadgeDollarSign,
            color: "bg-purple-500",
          },
          {
            label: "Pending Orders",
            value: pendingOrders,
            icon: Clock,
            color: "bg-orange-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-sm text-[#7a8a6a]">{label}</p>
            <p className="mt-1 text-3xl font-black text-[#1a1f16]">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#1a1f16]">All Customers</h2>
          <div className="relative">
            <Search
              size={15}
              onClick={() => setSearchTerm(searchName)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8a6a] cursor-pointer hover:text-[#4a7c59] transition"
            />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                if (!e.target.value.trim()) setSearchTerm("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchTerm(searchName);
              }}
              className="rounded-xl border border-[#e0d9cc] bg-[#faf8f3] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#4a7c59]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0d9cc] text-left">
                  {["ID", "Name", "Email", "Orders", "Total Spent", "Last Status", "First Order"].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-xs font-bold uppercase tracking-wider text-[#7a8a6a]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-[#f0ebe0] last:border-none hover:bg-[#faf8f3]"
                  >
                    <td className="py-4 text-sm text-[#7a8a6a]">#{customer.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#1a1f16]">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-[#7a8a6a]">{customer.email}</td>

                    {/* Orders count badge */}
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {customer.orderCount} order{customer.orderCount !== 1 ? "s" : ""}
                    </td>

                    {/* Total spent */}
                    <td className="py-4 text-sm font-semibold text-[#1a1f16]">
                      ৳{Number(customer.totalSpent).toLocaleString()}
                    </td>

                    {/* Last order status */}
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColor[customer.lastOrderStatus] ?? "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {customer.lastOrderStatus?.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        : "—"}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-[#7a8a6a]">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}