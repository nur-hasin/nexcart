"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Bike,
  Shield,
  ChevronRight,
  Package,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
  { label: "Admins", icon: Shield, href: "/dashboard/admin/admins" },
  { label: "Sellers", icon: ShoppingBag, href: "/dashboard/admin/sellers" },
  { label: "Orders", icon: Package, href: "/dashboard/admin/orders" },
  { label: "Riders", icon: Bike, href: "/dashboard/admin/riders" },
  { label: "Customers", icon: Users, href: "/dashboard/admin/customers" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "admin") {
      router.push("/login/admin");
      return;
    }

    // Decode JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAdminEmail(payload.email ?? "");
    } catch {}
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    toast.success("Logged out successfully");
    setTimeout(() => router.push("/login/admin"), 800);
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#f5f2eb]">
        {/* ── Sidebar ── */}
        <aside className="flex w-[220px] flex-col bg-[#1a1f16] border-r border-[#2d3329]">
          {/* Nav links */}
          <div className="flex-1 px-4 pt-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-[#5a6350]">
              ADMIN PANEL
            </p>
            <nav className="space-y-1">
              {navLinks.map(({ label, icon: Icon, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-[#4a7c59] text-white shadow-md"
                          : "text-[#8a9980] hover:bg-[#252b20] hover:text-[#c8d4b8]"
                      }`}
                  >
                    <Icon size={16} />
                    {label}
                    {isActive && (
                      <ChevronRight size={13} className="ml-auto opacity-70" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom admin info */}
          <div className="border-t border-[#2d3329] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4a7c59] text-xs font-bold text-white">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#c8d4b8]">
                  Admin
                </p>
                <p className="truncate text-[10px] text-[#5a6350]">
                  {adminEmail}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Content area ── */}
        <div className="flex flex-1 flex-col">
          {/* ── Page content ── */}
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #d1d5db",
            padding: "14px",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          },
          success: {
            style: { border: "1px solid #22c55e" },
            iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
          },
          error: {
            style: { border: "1px solid #ef4444" },
            iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          },
        }}
      />
    </>
  );
}
