"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Loader2,
  Search,
  Trash2,
  ShoppingBag,
  Store,
  Package,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

// TYPE — matches SellerEntity + relations
interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  nidNumber: string;
  shop?: {
    id: number;
    shopName: string;
    shopAddress: string;
    tradeLicense: string;
  };
  products?: { id: number; productName: string; price: number, quantity: number; }[];
  createdAt: string;
  quantity: number;
}

const authHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export default function SellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seller`, authHeader());
      // Backend returns { message, data: [...] }
      const raw = res.data?.data ?? [];
      setSellers(
        Array.isArray(raw)
          ? raw.sort((a: Seller, b: Seller) => a.id - b.id)
          : [],
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to load sellers");
      } else {
        toast.error("Failed to load sellers");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/seller/${id}`, authHeader());
      toast.success("Seller deleted");
      setSellers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to delete seller");
      } else {
        toast.error("Failed to delete seller");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Client-side search — starts-with word match
  const filtered = searchTerm.trim()
    ? sellers.filter((s) => {
      const search = searchTerm.toLowerCase().trim();
      const nameWords = s.name?.toLowerCase().split(" ") ?? [];
      const emailWords = s.email?.toLowerCase().split(/[@.]/) ?? [];
      return (
        nameWords.some((w) => w === search) ||
        emailWords.some((w) => w === search) ||
        s.email?.toLowerCase() === search ||
        String(s.id) === search
      );
    })
    : sellers;

  const totalProducts = sellers.reduce(
    (sum, s) => sum + (s.products?.length ?? 0),
    0,
  );
  const totalStock = sellers.reduce(
    (sum, seller) =>
      sum +
      (seller.products?.reduce(
        (acc: number, product) => acc + product.quantity,
        0
      ) ?? 0),
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1f16]">Sellers</h1>
        <p className="mt-1 text-sm text-[#7a8a6a]">
          Manage all seller accounts
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-5">
        {[
          {
            label: "Total Sellers",
            value: sellers.length,
            icon: ShoppingBag,
            color: "bg-[#4a7c59]",
          },
          {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "bg-blue-500",
          },
          {
            label: "Total Stock",
            value: totalStock,
            icon: Store,
            color: "bg-amber-500",
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
          <h2 className="text-xl font-black text-[#1a1f16]">All Sellers</h2>
          <div className="relative">
            <Search
              size={15}
              onClick={() => setSearchTerm(searchName)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8a6a] cursor-pointer hover:text-[#4a7c59] transition"
            />
            <input
              type="text"
              placeholder="Search sellers..."
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
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#7a8a6a]">
            No sellers found
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
                    "Shop",
                    "Products",
                    "Stock",
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
                {filtered.map((seller) => (
                  <tr
                    key={seller.id}
                    className="border-b border-[#f0ebe0] last:border-none hover:bg-[#faf8f3]"
                  >
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      #{seller.id}
                    </td>

                    {/* Name */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#1a1f16]">
                          {seller.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {seller.email}
                    </td>
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {seller.phone}
                    </td>

                    {/* Shop */}
                    <td className="py-4">
                      {seller.shop ? (
                        <span className="text-sm text-[#1a1f16]">
                          {seller.shop.shopName}
                        </span>
                      ) : (
                        <span className="text-sm text-[#7a8a6a]">—</span>
                      )}
                    </td>

                    {/* Products count */}
                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {seller.products?.length ?? 0} products
                    </td>

                    <td className="py-4 text-sm text-[#7a8a6a]">
                      {seller.products?.reduce(
                        (sum: number, product) => sum + product.quantity,
                        0
                      ) ?? "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {/* View → SSR dynamic route */}
                        <button
                          onClick={() =>
                            router.push(`/dashboard/admin/sellers/${seller.id}`)
                          }
                          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#e0d9cc] bg-[#faf8f3] px-3 py-1.5 text-xs font-semibold text-[#4a7c59] transition hover:bg-[#4a7c59] hover:text-white"
                        >
                          <Eye size={12} />
                          View
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(seller.id)}
                          disabled={deletingId === seller.id}
                          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                        >
                          {deletingId === seller.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
