import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Phone,
    Store,
    MapPin,
    FileText,
    Package,
    ShoppingBag,
    Tag,
} from "lucide-react";
import { cookies } from "next/headers";

// TYPES
interface Product {
    id: number;
    productName: string;
    category: string;
    description: string;
    price: number;
    quantity: number;
    productImage: string | null;
}

interface Shop {
    id: number;
    shopName: string;
    shopAddress: string;
    tradeLicense: string;
}

interface Seller {
    id: number;
    name: string;
    email: string;
    phone: string;
    nidNumber: string;
    shop: Shop | null;
    products: Product[];
    orderItems?: { id: number }[];
}

// SERVER-SIDE DATA FETCH
async function getSellerById(id: string, token: string): Promise<Seller | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/${id}`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`, //  pass token in header
            },
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.data ?? null;
    } catch {
        return null;
    }
}

// PAGE COMPONENT — async Server Component
export default async function SellerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";

    const seller = await getSellerById(id, token ?? "");

    // 404 if not found
    if (!seller) notFound();

    const totalProducts = seller.products?.length ?? 0;
    const totalValue = seller.products?.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0,
    ) ?? 0;

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-black text-blue-600">
                        {seller.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#1a1f16]">{seller.name}</h1>
                        <p className="mt-1 text-sm text-[#7a8a6a]">
                            Seller #{seller.id}
                        </p>
                    </div>
                </div>
                {/* Back button */}
                <div className="ms-auto mb-6">
                    <Link
                        href="/dashboard/admin/sellers"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#e0d9cc] bg-white px-4 py-2 text-sm font-semibold text-[#4a7c59] transition hover:bg-[#4a7c59] hover:text-white"
                    >
                        <ArrowLeft size={15} />
                        Back to Sellers
                    </Link>
                </div>
            </div>

            {/* Stat cards */}
            <div className="mb-8 grid grid-cols-3 gap-5">
                {[
                    {
                        label: "Total Products",
                        value: totalProducts,
                        icon: Package,
                        color: "bg-[#4a7c59]",
                    },
                    {
                        label: "Stock Value",
                        value: `৳${totalValue.toLocaleString()}`,
                        icon: Tag,
                        color: "bg-blue-500",
                    },
                    {
                        label: "Total Orders",
                        value: seller.orderItems?.length ?? 0,
                        icon: ShoppingBag,
                        color: "bg-green-500",
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
                        <p className="mt-1 text-2xl font-black text-[#1a1f16]">{value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {/* Seller Info */}
                <div className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-black text-[#1a1f16]">
                        Seller Information
                    </h2>
                    <div className="space-y-3">
                        {[
                            { icon: Mail, label: "Email", value: seller.email },
                            { icon: Phone, label: "Phone", value: seller.phone },
                            { icon: FileText, label: "NID Number", value: seller.nidNumber },
                        ].map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-xl bg-[#faf8f3] px-4 py-3"
                            >
                                <Icon size={15} className="shrink-0 text-[#7a8a6a]" />
                                <div>
                                    <p className="text-xs text-[#7a8a6a]">{label}</p>
                                    <p className="text-sm font-semibold text-[#1a1f16]">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shop Info */}
                <div className="rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-black text-[#1a1f16]">
                        Shop Information
                    </h2>
                    {seller.shop ? (
                        <div className="space-y-3">
                            {[
                                { icon: Store, label: "Shop Name", value: seller.shop.shopName },
                                { icon: MapPin, label: "Address", value: seller.shop.shopAddress },
                                { icon: FileText, label: "Trade License", value: seller.shop.tradeLicense },
                            ].map(({ icon: Icon, label, value }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 rounded-xl bg-[#faf8f3] px-4 py-3"
                                >
                                    <Icon size={15} className="shrink-0 text-[#7a8a6a]" />
                                    <div>
                                        <p className="text-xs text-[#7a8a6a]">{label}</p>
                                        <p className="text-sm font-semibold text-[#1a1f16]">
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-10">
                            <div className="text-center">
                                <Store size={32} className="mx-auto mb-2 text-[#c8d4b8]" />
                                <p className="text-sm text-[#7a8a6a]">No shop created yet</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Products */}
            <div className="mt-6 rounded-2xl border border-[#e0d9cc] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-black text-[#1a1f16]">
                    Products
                </h2>

                {totalProducts === 0 ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="text-center">
                            <ShoppingBag size={32} className="mx-auto mb-2 text-[#c8d4b8]" />
                            <p className="text-sm text-[#7a8a6a]">No products listed yet</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e0d9cc] text-left">
                                    {["ID", "Product Name", "Category", "Price", "Stock"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="pb-3 text-xs font-bold uppercase tracking-wider text-[#7a8a6a]"
                                            >
                                                {h}
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {seller.products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-[#f0ebe0] last:border-none hover:bg-[#faf8f3]"
                                    >
                                        <td className="py-4 text-sm text-[#7a8a6a]">
                                            #{product.id}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-[#1a1f16]">
                                                    {product.productName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-semibold text-[#1a1f16]">
                                            ৳{product.price.toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${product.quantity > 10
                                                    ? "bg-green-100 text-green-700"
                                                    : product.quantity > 0
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {product.quantity > 0
                                                    ? `${product.quantity} in stock`
                                                    : "Out of stock"}
                                            </span>
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