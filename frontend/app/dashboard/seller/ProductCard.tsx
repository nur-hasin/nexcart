"use client";

import { Package, Pencil, Trash2 } from "lucide-react";

const API_BASE_URL = "http://localhost:3000";

type Product = {
  id: number;
  productName: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  productImage?: string | null;
};

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const imageUrl = product.productImage
    ? `${API_BASE_URL}/uploads/products/${product.productImage}`
    : "";

  const qty = Number(product.quantity);

  const stockBadge =
    qty <= 0
      ? { label: "Out of Stock", cls: "bg-red-50 text-red-500" }
      : qty <= 5
        ? { label: `Low: ${qty}`, cls: "bg-amber-50 text-amber-600" }
        : { label: `${qty} in stock`, cls: "bg-green-50 text-green-600" };

  return (
    <div className="bg-green-50/50 border border-black/[0.07] rounded-2xl overflow-hidden hover:border-black/[0.13] hover:-translate-y-0.5 transition-all">
      <div className="h-40 bg-white flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={36} className="text-gray-300" />
        )}

        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-black/60 text-green-400 backdrop-blur-sm border border-green-600/30">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <p className="text-[15px] font-bold text-gray-900 truncate mb-1.5">
          {product.productName}
        </p>

        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {product.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-extrabold text-green-600">
            ৳{Number(product.price).toLocaleString()}
          </span>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md ${stockBadge.cls}`}
          >
            {stockBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition"
          >
            <Pencil size={12} /> Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
