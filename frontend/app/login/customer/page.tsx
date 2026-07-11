"use client";

import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function CustomerLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    if (token && role) window.location.href = `/dashboard/${role}`;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      toast.error("Please fix the form errors");
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/customer/login`, {
        email: formData.email,
        password: formData.password,
      });

      Cookies.set("token", res.data.token);
      Cookies.set("role", "customer");
      toast.success("Welcome back! 🎉");
      window.location.href = "/dashboard/customer";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

        {/* ── Left Panel ── */}
        <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-12 text-white overflow-hidden">
          {/* Background blobs */}
          <div className="absolute top-[-60px] left-[-60px] w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-purple-400/20 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center ring-1 ring-white/30">
              <ShoppingBag size={30} className="text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">NexCart</h1>
              <p className="text-indigo-200 mt-2 text-sm leading-relaxed max-w-xs">
                Your one-stop shop for everything. Fast delivery, easy returns, and great deals.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-2 w-full mt-2">
              {["🚚 Free delivery on orders over $50", "🔒 Secure & encrypted checkout", "⭐ 10,000+ happy customers"].map((f) => (
                <div key={f} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 text-sm font-medium backdrop-blur-sm">
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">

          {/* Logo (mobile only) */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-800">NexCart</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1.5">Sign in to your customer account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3.5 text-sm text-slate-800 font-medium outline-none transition-all placeholder:text-slate-300
                  focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  ${errors?.email ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              />
              {errors?.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  <Lock size={12} /> Password
                </label>
                <a href="#" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3.5 pr-11 text-sm text-slate-800 font-medium outline-none transition-all placeholder:text-slate-300
                    focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    ${errors?.password ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors?.password && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password[0]}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register/customer"
              className="text-indigo-600 font-bold hover:text-indigo-800 transition"
            >
              Create one →
            </Link>
          </p>


        </div>

      </div>
    </div>
  );
}