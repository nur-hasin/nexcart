"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";

const customerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" }),

    email: z
      .string()
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function CustomerRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = customerSchema.safeParse(formData);

    // Zod Validation
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);

      toast.error("Please fix the form errors");

      return;
    }

    try {
      setLoading(true);

      // Backend API Call
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log(res.data);

      // Success Toast
      toast.success(
        "Customer Registration Successful 🎉"
      );

      setErrors({});

      // Reset Form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error: any) {
      console.log(error);

      // Error Toast
      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-green-100 to-white px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-green-600 mb-2">
          Customer Register
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Create your customer account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors?.name?.[0]}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors?.email?.[0]}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors?.password?.[0]}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors?.confirmPassword?.[0]}
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login/customer"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}