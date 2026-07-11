"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader2, Search, Trash2, Bike, UserCheck, MapPin } from "lucide-react";
import { toast } from "react-toastify";

interface Rider {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: "available" | "busy" | "offline";
  vehicle_type?: string;
  current_location?: string;
}

const authHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/riders/all-riders`,
        authHeader(),
      );
      const data = Array.isArray(res.data) ? res.data : [];

      const sorted = data.sort((a: Rider, b: Rider) => a.id - b.id);
      setRiders(sorted);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to load riders");
      } else {
        toast.error("Failed to load riders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/riders/${id}`, authHeader());
      toast.success("Rider deleted");
      setRiders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to delete rider");
      } else {
        toast.error("Failed to delete rider");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = searchTerm.trim()
    ? riders.filter((r) => {
      const search = searchTerm.toLowerCase().trim();
      const nameWords = r.name?.toLowerCase().split(" ") ?? [];
      const emailWords = r.email?.toLowerCase().split(/[@.]/) ?? [];
      return (
        nameWords.some((w) => w === search) ||
        emailWords.some((w) => w === search) ||
        r.email?.toLowerCase() === search ||
        String(r.id) === search
      );
    })
    : riders;

  const available = riders.filter((r) => r.status === "available").length;
  const active = riders.filter((r) => r.status !== "offline").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1f16]">Riders</h1>
        <p className="mt-1 text-sm text-[#7a8a6a]">
          Manage all delivery riders
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-5">
        {[
          {
            label: "Total Riders",
            value: riders.length,
            icon: Bike,
            color: "bg-[#4a7c59]",
          },
          {
            label: "Available Now",
            value: available,
            icon: MapPin,
            color: "bg-green-500",
          },
          {
            label: "Active Riders",
            value: active,
            icon: UserCheck,
            color: "bg-blue-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
            >
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
          <h2 className="text-xl font-black text-[#1a1f16]">All Riders</h2>
          <div className="relative">
            <Search
              size={15}
              onClick={() => setSearchTerm(searchName)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8a6a] cursor-pointer hover:text-[#4a7c59] transition"
            />
            <input
              type="text"
              placeholder="Search riders..."
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
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Phone",
                    "Status",
                    "Vehicle",
                    "Location",
                    "Action",
                  ].map((h) => (
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
                {filtered.map((rider) => (
                  <tr
                    key={rider.id}
                    className="border-b border-[#f0ebe0] last:border-none hover:bg-[#faf8f3]"
                  >
                    <td className="py-4 text-sm text-[#7a8a6a]">#{rider.id}</td>

                    {/* Name */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#1a1f16]">
                          {rider.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {rider.email}
                    </td>

                    {/* Phone */}
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {rider.phone ?? "—"}
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${rider.status === "available"
                            ? "bg-green-100 text-green-700"
                            : rider.status === "busy"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {rider.status === "available"
                          ? "Available"
                          : rider.status === "busy"
                            ? "Busy"
                            : "Offline"}
                      </span>
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {rider.vehicle_type ?? "—"}
                    </td>

                    {/* Location */}
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {rider.current_location ?? "—"}
                    </td>

                    {/* Action */}
                    <td className="py-4">
                      <button
                        onClick={() => handleDelete(rider.id)}
                        disabled={deletingId === rider.id}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        {deletingId === rider.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-sm text-[#7a8a6a]"
                    >
                      No riders found
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
