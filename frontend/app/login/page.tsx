"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect } from "react";

const roles = [
  {
    title: "Admin",
    description: "Control users, products, orders, and platform settings.",
    href: "/login/admin",
    color: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "🛡️",
  },
  {
    title: "Seller",
    description:
      "Manage products, orders, and your online shop.",
    href: "/login/seller",
    color: "from-green-500 to-green-600",
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "🏪",
  },
  {
    title: "Rider",
    description:
      "View assigned deliveries and update delivery status.",
    href: "/login/rider",
    color: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "🏍️",
  },
  {
    title: "Customer",
    description: "Browse products, manage orders, and track purchases.",
    href: "/login/customer",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "🛒",
  },
];

export default function LoginPage() {

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    // Redirect if already logged in
    if (token && role) {
      window.location.href = `/dashboard/${role}`;
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-12">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur-md md:p-10">

          {/* Header */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-4 inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-medium text-white">
              NexCart Login
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Select Your Login Role
            </h1>
          </div>

          {/* Role Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <Link
                key={role.title}
                href={role.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${role.bg} text-2xl`}
                >
                  {role.icon}
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  {role.title}
                </h2>

                <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">
                  {role.description}
                </p>

                <div
                  className={`mt-6 flex items-center justify-center rounded-xl bg-gradient-to-r ${role.color} px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 group-hover:shadow-lg`}
                >
                  Continue as {role.title}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-sm text-slate-500">
            New to NexCart? Choose your role and register from the login page.
          </div>

        </div>
      </section>
    </main>
  );
}
