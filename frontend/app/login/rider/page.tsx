"use client";

import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export default function RiderLoginPage() {

  // Redirect if already logged in
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      window.location.href = `/dashboard/${role}`;
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      setErrors(
        result.error.flatten().fieldErrors
      );

      toast.error("Please fix the form errors");

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/riders/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log(res.data);

      // SAVE TOKEN
      Cookies.set(
        "token",
        res.data.access_token
      );

      // SAVE ROLE
      Cookies.set("role", "rider");

      toast.success("Login Successful 🎉");

      // REDIRECT
      window.location.href =
        "/dashboard/rider";

    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-xl bg-[#f4f4f4] rounded-[40px] shadow-xl px-8 py-10 md:px-10">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#08132b] flex items-center justify-center text-white text-3xl">
            ↪
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-[#08132b] mb-2">
          Rider Login
        </h1>

        <p className="text-center text-gray-500 text-base mb-8">
          Access your rider dashboard
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Email */}
          <div>
            <label className="block text-gray-500 mb-2 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full bg-[#dfe5f1] border border-gray-300 rounded-[18px] px-5 py-3 text-lg outline-none"
            />

            <p className="text-red-500 text-sm mt-2">
              {errors?.email?.[0]}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-500 mb-2 text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full bg-[#dfe5f1] border border-gray-300 rounded-[18px] px-5 py-3 text-lg outline-none"
            />

            <p className="text-red-500 text-sm mt-2">
              {errors?.password?.[0]}
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#08132b] hover:bg-[#0d1c3f] transition text-white py-3 rounded-[18px] text-xl font-bold mt-4"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Don&apos;t have a rider account?{" "}
          <Link
            href="/register/rider"
            className="font-bold text-[#08132b]"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}