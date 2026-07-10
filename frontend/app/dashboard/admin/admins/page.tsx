"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Loader2,
  Search,
  Shield,
  UserCheck,
  UserX,
  Clock,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

// TYPE
interface Admin {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
}

const authHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

// Get logged-in admin id from token
const getMyId = (): number | null => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

// COMPONENT
export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const myId = getMyId();
  const [searchName, setSearchName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/admin", authHeader());
      const data = Array.isArray(res.data) ? res.data : [];

      // Always sort by ID ascending — oldest first, stable order
      const sorted = data.sort((a: Admin, b: Admin) => a.id - b.id);
      setAdmins(sorted);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  //  Approve admin
  const handleApprove = async (id: number) => {
    try {
      setActionId(id);
      await axios.patch(
        `http://localhost:3000/admin/${id}/approve`,
        {},
        authHeader(),
      );
      toast.success("Admin approved successfully");
      fetchAdmins();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to approve");
      } else {
        toast.error("Failed to approve");
      }
    } finally {
      setActionId(null);
    }
  };

  const displayAdmins = searchTerm.trim()
    ? admins.filter((a) => {
        const search = searchTerm.toLowerCase().trim();
        const nameWords = a.name?.toLowerCase().split(" ") ?? [];
        const emailWords = a.email?.toLowerCase().split(/[@.]/) ?? [];
        return (
          nameWords.some((w) => w === search) ||
          emailWords.some((w) => w === search) ||
          a.email?.toLowerCase() === search ||
          String(a.id) === search
        );
      })
    : admins;

  //  Deny admin (removes account)
  const handleDeny = async (id: number) => {
    try {
      setActionId(id);
      await axios.patch(
        `http://localhost:3000/admin/${id}/deny`,
        {},
        authHeader(),
      );
      toast.success("Admin denied and removed");
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to deny");
      } else {
        toast.error("Failed to deny");
      }
    } finally {
      setActionId(null);
    }
  };

  //  Deactivate (soft delete)
  const handleDeactivate = async (id: number) => {
    try {
      setActionId(id);
      await axios.patch(
        `http://localhost:3000/admin/${id}/deactivate`,
        {},
        authHeader(),
      );
      toast.success("Admin deactivated");
      fetchAdmins();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to deactivate");
      } else {
        toast.error("Failed to deactivate");
      }
    } finally {
      setActionId(null);
    }
  };

  //  Reactivate
  const handleActivate = async (id: number) => {
    try {
      setActionId(id);
      await axios.patch(
        `http://localhost:3000/admin/${id}/activate`,
        {},
        authHeader(),
      );
      toast.success("Admin reactivated");
      fetchAdmins();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to activate");
      } else {
        toast.error("Failed to activate");
      }
    } finally {
      setActionId(null);
    }
  };

  const approved = admins.filter((a) => a.isApproved).length;
  const pending = admins.filter((a) => !a.isApproved).length;
  const active = admins.filter((a) => a.isActive).length;
  const inactive = admins.filter((a) => !a.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1f16]">Admins</h1>
        <p className="mt-1 text-sm text-[#7a8a6a]">
          Review pending admin requests and manage account access{" "}
        </p>
      </div>

      {/* Stat row */}
      <div className="mb-8 grid grid-cols-5 gap-5">
        {[
          {
            label: "Total Admins",
            value: admins.length,
            icon: Shield,
            color: "bg-[#4a7c59]",
          },
          {
            label: "Approved",
            value: approved,
            icon: UserCheck,
            color: "bg-green-500",
          },
          {
            label: "Pending",
            value: pending,
            icon: Clock,
            color: "bg-amber-500",
          },
          {
            label: "Active",
            value: active,
            icon: ShieldCheck,
            color: "bg-blue-500",
          },
          {
            label: "Inactive",
            value: inactive,
            icon: ShieldOff,
            color: "bg-gray-400",
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
          <div>
            <h2 className="text-xl font-black text-[#1a1f16]">All Admins</h2>
          </div>
          <div className="relative">
            <Search
              size={15}
              onClick={() => setSearchTerm(searchName)}
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7a8a6a] transition hover:text-[#4a7c59]"
            />
            <input
              type="text"
              placeholder="Search admins..."
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
                    "Approval",
                    "Status",
                    "Joined",
                    "Actions",
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
                {displayAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className={`border-b border-[#f0ebe0] last:border-none transition hover:bg-[#faf8f3]
                    ${admin.isApproved && !admin.isActive ? "opacity-60 bg-gray-50" : ""}
                    ${!admin.isApproved ? "bg-amber-50/40" : ""}`}
                  >
                    <td className="py-4 text-sm text-[#7a8a6a]">#{admin.id}</td>

                    {/* Name */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-sm font-semibold text-[#1a1f16]">
                            {admin.name}
                          </span>
                          {admin.id === myId && (
                            <span className="ml-2 rounded-full bg-[#4a7c59] px-2 py-0.5 text-[10px] font-bold text-white">
                              You
                            </span>
                          )}
                          {admin.isApproved && !admin.isActive && (
                            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                              Suspended
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {admin.email}
                    </td>

                    {/* Approval */}
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${admin.isApproved ? "bg-[#d4e6c3] text-[#4a7c59]" : "bg-amber-100 text-amber-700"}`}
                      >
                        {admin.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    {/* Active status */}
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${admin.isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {new Date(admin.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4">
                      {admin.id === myId ? (
                        <span className="text-xs text-[#7a8a6a] italic">
                          Your account
                        </span>
                      ) : !admin.isApproved ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(admin.id)}
                            disabled={actionId === admin.id}
                            className="flex items-center gap-1 rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-600 disabled:opacity-50"
                          >
                            {actionId === admin.id ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <UserCheck size={11} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(admin.id)}
                            disabled={actionId === admin.id}
                            className="flex items-center gap-1 rounded-xl bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                          >
                            {actionId === admin.id ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <UserX size={11} />
                            )}
                            Deny
                          </button>
                        </div>
                      ) : admin.isActive ? (
                        <button
                          onClick={() => handleDeactivate(admin.id)}
                          disabled={actionId === admin.id}
                          className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white disabled:opacity-50"
                        >
                          {actionId === admin.id ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <ShieldOff size={11} />
                          )}
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(admin.id)}
                          disabled={actionId === admin.id}
                          className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-500 hover:text-white disabled:opacity-50"
                        >
                          {actionId === admin.id ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <ShieldCheck size={11} />
                          )}
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {displayAdmins.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-sm text-[#7a8a6a]"
                    >
                      No admins found
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
