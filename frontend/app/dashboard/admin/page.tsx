"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Loader2,
  TrendingUp,
  ShoppingBag,
  Bike,
  Package,
  Mail,
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";

// TYPES
interface AdminProfile {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: number;
  totalSellers: number;
  activeRiders: number;
  totalRevenue: number;
}

const authHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

// COMPONENT
export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSellers: 0,
    activeRiders: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit profile state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  //  Fetch profile 
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = Cookies.get("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${payload.sub}`,
        authHeader(),
      );
      setProfile(res.data);
      setEditName(res.data.name ?? "");
      setEditEmail(res.data.email ?? "");
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  //  Fetch dashboard stats from real backend 
  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      // Fetch in parallel
      const [ordersRes, sellersRes, ridersRes] = await Promise.allSettled([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/orders-details`,
          authHeader(),
        ),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seller`, authHeader()),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/riders/available`),
      ]);

      // Total orders
      const orders =
        ordersRes.status === "fulfilled"
          ? Array.isArray(ordersRes.value.data)
            ? ordersRes.value.data
            : []
          : [];

      // Total sellers
      const sellers =
        sellersRes.status === "fulfilled"
          ? Array.isArray(sellersRes.value.data?.data)
            ? sellersRes.value.data.data
            : []
          : [];

      // Available riders
      const riders =
        ridersRes.status === "fulfilled"
          ? Array.isArray(ridersRes.value.data)
            ? ridersRes.value.data
            : []
          : [];

      // Revenue — sum price × quantity of delivered orders
      const revenue = orders
        .filter((o: any) => o.status === "delivered")
        .reduce((total: number, order: any) => {
          const orderTotal = (order.orderItems ?? []).reduce(
            (sum: number, item: any) =>
              sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
            0,
          );
          return total + orderTotal;
        }, 0);

      setStats({
        totalOrders: orders.length,
        totalSellers: sellers.length,
        activeRiders: riders.length,
        totalRevenue: revenue,
      });
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  //  Update own profile (PATCH) 
  const handleUpdateProfile = async () => {
    if (!profile) return;
    try {
      setSaving(true);

      const updateData: Record<string, string> = {};
      if (editName.trim() && editName !== profile.name) {
        updateData.name = editName.trim();
      }
      if (editEmail.trim() && editEmail !== profile.email) {
        updateData.email = editEmail.trim();
      }
      if (editPassword.trim()) {
        updateData.password = editPassword.trim();
      }

      if (Object.keys(updateData).length === 0) {
        toast.error("No changes to save");
        return;
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${profile.id}`,
        updateData,
        authHeader(),
      );

      toast.success("Profile updated successfully!");
      setEditPassword("");
      fetchProfile();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  //  Stat card config 
  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      change: "All time",
      icon: Package,
      color: "bg-green-700",
    },
    {
      label: "Total Sellers",
      value: stats.totalSellers,
      change: "Registered",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Available Riders",
      value: stats.activeRiders,
      change: "Ready now",
      icon: Bike,
      color: "bg-orange-500",
    },
    {
      label: "Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      change: "From delivered orders",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1f16]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#7a8a6a]">
          Welcome back,{" "}
          <span className="font-semibold text-[#4a7c59]">
            {profile?.name ?? "..."}
          </span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
            >
              <card.icon size={18} className="text-white" />
            </div>
            <p className="text-sm text-[#7a8a6a]">{card.label}</p>
            {loadingStats ? (
              <Loader2 size={20} className="mt-2 animate-spin text-[#4a7c59]" />
            ) : (
              <p className="mt-1 text-3xl font-black text-[#1a1f16]">
                {card.value}
              </p>
            )}
            <p className="mt-1 text-xs font-semibold text-[#4a7c59]">
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Profile + Edit section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/*  My Profile card  */}
        <div className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-black text-[#1a1f16]">My Profile</h2>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-[#4a7c59]" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4a7c59] text-2xl font-black text-white">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-black text-[#1a1f16]">
                    {profile?.name}
                  </p>
                  <p className="text-sm text-[#7a8a6a]">{profile?.email}</p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">

                    {/* Approved by another admin */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold
                          ${profile?.isApproved
                          ? "bg-[#d4e6c3] text-[#4a7c59]"
                          : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {profile?.isApproved
                        ? "✓ Approved"
                        : "⏳ Pending Approval"}
                    </span>

                    {/* Account active status */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold
                        ${profile?.isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {profile?.isActive ? "● Active" : "● Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0ebe0] pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] px-4 py-3">
                    <User size={15} className="text-[#7a8a6a]" />
                    <div>
                      <p className="text-xs text-[#7a8a6a]">Full Name</p>
                      <p className="text-sm font-semibold text-[#1a1f16]">
                        {profile?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] px-4 py-3">
                    <Mail size={15} className="text-[#7a8a6a]" />
                    <div>
                      <p className="text-xs text-[#7a8a6a]">Email</p>
                      <p className="text-sm font-semibold text-[#1a1f16]">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] px-4 py-3">
                    <Package size={15} className="text-[#7a8a6a]" />
                    <div>
                      <p className="text-xs text-[#7a8a6a]">Member Since</p>
                      <p className="text-sm font-semibold text-[#1a1f16]">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/*  Edit Profile card  */}
        <div className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-black text-[#1a1f16]">
            Update Profile
          </h2>
          <p className="mb-6 text-xs text-[#7a8a6a]">
            You can update your own name, email and password.
          </p>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a8a6a]">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8a6a]"
                />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-[#e0d9cc] bg-[#faf8f3] py-3 pl-9 pr-4 text-sm text-[#1a1f16] outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a8a6a]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8a6a]"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder={profile?.email ?? "Enter email"}
                  className="w-full rounded-xl border border-[#e0d9cc] bg-[#faf8f3] py-3 pl-9 pr-4 text-sm text-[#1a1f16] outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a8a6a]">
                New Password{" "}
                <span className="normal-case text-[#b5c99a]">
                  (leave blank to keep current)
                </span>
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8a6a]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e0d9cc] bg-[#faf8f3] py-3 pl-9 pr-10 text-sm text-[#1a1f16] outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8a6a] transition hover:text-[#1a1f16]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a7c59] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#3d6b4a] active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </button>

            {/* No delete warning */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs text-amber-700">
                ⚠ Self-deactivation is not allowed. At least one active admin
                must exist at all times to keep the system operational.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
