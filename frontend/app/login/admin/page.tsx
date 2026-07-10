"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// ZOD SCHEMA
const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// TYPE DEFINITION
type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// COMPONENT
export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onTouched",
  });

  // SUBMIT → Zod → API → JWT → Redirect
  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setLoading(true);

      // Axios API call
      const response = await axios.post(
        "http://localhost:3000/admin/login",
        data,
      );

      // Store token in cookie
      Cookies.set("token", response.data.access_token, {
        expires: 1 / 24, // 1 hour
        sameSite: "strict",
      });

      // Store role
      Cookies.set("role", "admin", {
        expires: 1 / 24,
        sameSite: "strict",
      });

      toast.success("Login successful!");

      // Redirect
      router.push("/dashboard/admin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role === "admin") {
      router.push("/dashboard/admin");
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-50">
        {/* ── Page body ── */}
        <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-gray-100">
              {/* Card header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-2xl text-white shadow-lg shadow-green-200">
                  <ShieldCheck className="text-white" size={38} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                  Admin Login
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Sign in to manage your NexCart platform
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@nexcart.com"
                    {...register("email")}
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2
                    ${
                      errors.email
                        ? "border-red-400 focus:ring-red-100"
                        : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      ⚠ {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2
                      ${
                        errors.password
                          ? "border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">
                      ⚠ {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium text-green-600 transition hover:text-green-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    "LOGIN"
                  )}
                </button>

                {/* Register link */}
                <p className="text-center text-sm text-gray-500">
                  Don&apos;t have an account? {"  "}
                  <span
                    onClick={() => router.push("/register/admin")}
                    className="cursor-pointer font-semibold text-green-600 transition hover:text-green-700 hover:underline"
                  >
                    Request Access
                  </span>
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
