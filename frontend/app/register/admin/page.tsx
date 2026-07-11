"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

const adminRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(/^[A-Za-z\s]+$/, "Name must contain only letters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegisterFormData>({
    resolver: zodResolver(adminRegisterSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: AdminRegisterFormData) => {
    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created! Awaiting approval.");
      setTimeout(() => router.push("/login/admin"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-50">
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-gray-100">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200">
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Admin Register
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create your NexCart admin account
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"}`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">
                    ⚠ {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@nexcart.com"
                  {...register("email")}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"}`}
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
                    className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition focus:ring-2 ${errors.password ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition focus:ring-2 ${errors.confirmPassword ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    ⚠ {errors.confirmPassword.message}
                  </p>
                )}
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
                    Creating account…
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/login/admin")}
                  className="cursor-pointer font-semibold text-green-600 hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
