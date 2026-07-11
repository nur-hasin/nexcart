"use client";

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// import {
//   LayoutDashboard,
//   Package,
//   ShoppingBag,
//   User,
//   LogOut,
//   Plus,
//   Pencil,
//   Trash2,
//   Upload,
//   Store,
//   MapPin,
//   BadgeCheck,
//   Boxes,
//   AlertTriangle,
//   Wallet,
//   Layers3,
//   ChevronRight,
//   TrendingUp,
// } from "lucide-react";

// const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// const PRODUCT_CATEGORIES = [
//   "Electronics",
//   "Fashion",
//   "Home & Living",
//   "Beauty",
//   "Sports",
// ];

// type SellerShop = {
//   id: number;
//   shopName: string;
//   shopAddress: string;
//   tradeLicense: string;
// };

// type Seller = {
//   id: number;
//   name: string;
//   email: string;
//   phone?: string;
//   nidNumber?: string;
//   nidImage?: string | null;
//   shop?: SellerShop | null;
// };

// type Product = {
//   id: number;
//   productName: string;
//   category: string;
//   description?: string | null;
//   price: number;
//   quantity: number;
//   productImage?: string | null;
// };
// type OrderItem = {
//   id: number;
//   quantity: number;
//   price: number;

//   status: "pending" | "accepted" | "rejected" | "processing";

//   product?: {
//     id: number;
//     productName: string;
//     category: string;
//     productImage?: string | null;
//   };
// };

// type Order = {
//   id: number;
//   status: "pending" | "processing" | "delivered" | "cancelled";
//   paymentMethod: string;
//   totalAmount: number;
//   createdAt: string;

//   customer?: {
//     id: number;
//     name: string;
//   };

//   orderItems?: OrderItem[];
// };

// type ProductForm = {
//   productName: string;
//   category: string;
//   description: string;
//   price: string;
//   quantity: string;
// };

// type SellerProfileForm = {
//   name: string;
//   email: string;
//   phone: string;
//   nidNumber: string;
// };

// const emptyForm: ProductForm = {
//   productName: "",
//   category: "",
//   description: "",
//   price: "",
//   quantity: "",
// };

// const emptyProfileForm: SellerProfileForm = {
//   name: "",
//   email: "",
//   phone: "",
//   nidNumber: "",
// };

// const statIconClasses: Record<string, string> = {
//   green: "bg-green-100 text-green-600",
//   blue: "bg-blue-100 text-blue-500",
//   red: "bg-red-100 text-red-500",
//   amber: "bg-amber-100 text-amber-600",
//   purple: "bg-purple-100 text-purple-500",
// };

// const inputCls =
//   "w-full bg-green-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition";

// const labelCls =
//   "block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5";

// export default function SellerDashboardPage() {
//   const [activeSection, setActiveSection] = useState<
//     "dashboard" | "products" | "orders" | "profile"
//   >("dashboard");

//   const [seller, setSeller] = useState<Seller | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [productsLoading, setProductsLoading] = useState(true);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [form, setForm] = useState<ProductForm>(emptyForm);
//   const [productImage, setProductImage] = useState<File | null>(null);
//   const [editingProductId, setEditingProductId] = useState<number | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [profileForm, setProfileForm] =
//     useState<SellerProfileForm>(emptyProfileForm);
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [profileUpdating, setProfileUpdating] = useState(false);

//   const statistics = useMemo(() => {
//     const totalProducts = products.length;
//     const totalStock = products.reduce(
//       (sum, p) => sum + Number(p.quantity || 0),
//       0,
//     );
//     const outOfStock = products.filter((p) => Number(p.quantity) <= 0).length;
//     const totalInventoryValue = products.reduce(
//       (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
//       0,
//     );
//     const activeCategories = new Set(
//       products.map((p) => p.category).filter(Boolean),
//     ).size;
//     return {
//       totalProducts,
//       totalStock,
//       outOfStock,
//       totalInventoryValue,
//       activeCategories,
//     };
//   }, [products]);

//   useEffect(() => {
//     const savedToken = Cookies.get("token");
//     const savedSeller = Cookies.get("seller");
//     if (!savedToken || !savedSeller) {
//       toast.error("Please login first");
//       window.location.href = "/login/seller";
//       return;
//     }
//     try {
//       const parsedSeller = JSON.parse(savedSeller) as Seller;
//       setSeller(parsedSeller);
//       setProfileForm({
//         name: parsedSeller.name || "",
//         email: parsedSeller.email || "",
//         phone: parsedSeller.phone || "",
//         nidNumber: parsedSeller.nidNumber || "",
//       });
//       loadSellerProducts(parsedSeller.id);
//       loadSellerOrders(parsedSeller.id);
//     } catch {
//       Cookies.remove("token");
//       Cookies.remove("seller");
//       toast.error("Session expired");
//       window.location.href = "/login/seller";
//     }
//   }, []);

//   const loadSellerProducts = async (sellerId: number) => {
//     try {
//       setProductsLoading(true);
//       const response = await axios.get(
//         `${API_BASE_URL}/seller/${sellerId}/products`,
//         {
//           headers: {
//             Authorization: `Bearer ${Cookies.get("token")}`,
//           },
//         },
//       );
//       const productList = Array.isArray(response.data)
//         ? response.data
//         : response.data?.data || [];
//       setProducts(productList);
//     } catch {
//       toast.error("Failed to load products");
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   const loadSellerOrders = async (sellerId: number) => {
//     try {
//       setOrdersLoading(true);

//       const response = await axios.get(
//         `${API_BASE_URL}/seller/${sellerId}/orders`,
//         {
//           headers: {
//             Authorization: `Bearer ${Cookies.get("token")}`,
//           },
//         },
//       );

//       const orderList = Array.isArray(response.data)
//         ? response.data
//         : response.data?.data || [];

//       console.log(orderList);

//       setOrders(orderList);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load orders");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     Cookies.remove("token");
//     Cookies.remove("seller");
//     toast.success("Logged out successfully");
//     setTimeout(() => {
//       window.location.href = "/login/seller";
//     }, 700);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setProfileForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetForm = () => {
//     setForm(emptyForm);
//     setProductImage(null);
//     setEditingProductId(null);
//   };

//   const handleSubmitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const token = Cookies.get("token");
//     if (!token || !seller) return;
//     try {
//       setSubmitting(true);
//       const formData = new FormData();
//       formData.append("productName", form.productName);
//       formData.append("category", form.category);
//       formData.append("description", form.description);
//       formData.append("price", form.price);
//       formData.append("quantity", form.quantity);
//       if (productImage) formData.append("productImage", productImage);

//       if (editingProductId) {
//         await axios.patch(
//           `${API_BASE_URL}/seller/products/${editingProductId}`,
//           formData,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         toast.success("Product updated");
//       } else {
//         await axios.post(
//           `${API_BASE_URL}/seller/${seller.id}/products`,
//           formData,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         toast.success("Product created");
//       }
//       resetForm();
//       loadSellerProducts(seller.id);
//     } catch {
//       toast.error("Operation failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setActiveSection("products");
//     setEditingProductId(product.id);
//     setForm({
//       productName: product.productName,
//       category: product.category,
//       description: product.description || "",
//       price: String(product.price),
//       quantity: String(product.quantity),
//     });
//   };

//   const handleDelete = async (productId: number) => {
//     const token = Cookies.get("token");
//     if (!token || !seller) return;
//     if (!confirm("Delete this product?")) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/seller/products/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Product deleted");
//       loadSellerProducts(seller.id);
//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//   const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const token = Cookies.get("token");
//     if (!token || !seller) return;
//     try {
//       setProfileUpdating(true);
//       const formData = new FormData();
//       formData.append("name", profileForm.name);
//       formData.append("email", profileForm.email);
//       formData.append("phone", profileForm.phone);
//       formData.append("nidNumber", profileForm.nidNumber);
//       if (profileImage) formData.append("nidImage", profileImage);

//       const response = await axios.patch(
//         `${API_BASE_URL}/seller/${seller.id}`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       const updatedSeller = response.data?.data || response.data;
//       setSeller(updatedSeller);
//       Cookies.set("seller", JSON.stringify(updatedSeller), {
//         expires: 1,
//         sameSite: "lax",
//       });
//       toast.success("Profile updated");
//     } catch {
//       toast.error("Update failed");
//     } finally {
//       setProfileUpdating(false);
//     }
//   };

//   const updateOrderItemStatus = async (
//     orderItemId: number,
//     status: "pending" | "accepted" | "rejected" | "processing",
//   ) => {
//     try {
//       const token = Cookies.get("token");
//       if (!token) return;

//       await axios.patch(
//         `${API_BASE_URL}/seller/order-items/${orderItemId}/status`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       toast.success("Order item updated");

//       if (seller) {
//         loadSellerOrders(seller.id);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update order item");
//     }
//   };
//   //

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { id: "products", label: "Products", icon: Package },
//     { id: "orders", label: "Orders", icon: ShoppingBag },
//     { id: "profile", label: "Profile", icon: User },
//   ];

//   const sectionTitles: Record<string, string> = {
//     dashboard: "Overview",
//     products: "Manage Products",
//     orders: "Orders",
//     profile: "Seller Profile",
//   };

//   return (
//     <div className="flex min-h-screen bg-green-50">
//       {/* ── SIDEBAR ── */}
//       <aside className="w-[260px] min-h-screen bg-[#0d3d24] flex flex-col flex-shrink-0 sticky top-0 px-5 py-7">
//         {/* Logo */}
//         <div className="flex items-center gap-3 px-2 pb-7 mb-6 border-b border-white/[0.08]">
//           <div className="w-9 h-9 bg-green-400 rounded-xl flex items-center justify-center flex-shrink-0 text-[#0d3d24]">
//             <TrendingUp size={18} />
//           </div>
//           <span className="text-white font-bold text-lg tracking-tight">
//             Nex<span className="text-green-400">Cart</span>
//           </span>
//         </div>

//         {/* Nav label */}
//         <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/30 px-2 mb-2">
//           Navigation
//         </p>

//         {/* Nav items */}
//         <nav className="flex flex-col gap-0.5">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeSection === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() =>
//                   setActiveSection(item.id as typeof activeSection)
//                 }
//                 className={`relative flex items-center gap-3 w-full text-left px-3 py-[11px] rounded-xl text-sm font-medium transition-all
//                   ${
//                     isActive
//                       ? "bg-green-400/15 text-green-400"
//                       : "text-white/55 hover:bg-white/[0.08] hover:text-white"
//                   }`}
//               >
//                 {isActive && (
//                   <span className="absolute left-0 top-[20%] h-[60%] w-[3px] bg-green-400 rounded-r-full" />
//                 )}
//                 <Icon size={18} className="flex-shrink-0 opacity-90" />
//                 <span>{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         <div className="flex-1" />

//         {/* User footer */}
//         <div className="flex items-center gap-2.5 pt-5 mt-5 border-t border-white/[0.08]">
//           <img
//             src={
//               seller?.nidImage
//                 ? `${API_BASE_URL}/uploads/${seller.nidImage}`
//                 : "/avatar.png"
//             }
//             alt="avatar"
//             className="w-9 h-9 rounded-xl object-cover border border-white/15 flex-shrink-0"
//           />
//           <div className="flex-1 overflow-hidden">
//             <p className="text-[13px] font-semibold text-white truncate">
//               {seller?.name || "Seller"}
//             </p>
//             <p className="text-[11px] text-white/35">Seller Account</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             title="Logout"
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/12 text-white/40 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all flex-shrink-0"
//           >
//             <LogOut size={15} />
//           </button>
//         </div>
//       </aside>

//       {/* ── MAIN ── */}
//       <main className="flex-1 min-w-0 flex flex-col">
//         {/* Topbar */}
//         <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-black/[0.07] sticky top-0 z-10">
//           <div className="flex flex-col gap-0.5">
//             <div className="flex items-center gap-1.5 text-xs text-gray-400">
//               <span>NexCart</span>
//               <ChevronRight size={13} />
//               <span>{sectionTitles[activeSection]}</span>
//             </div>
//             <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
//               {sectionTitles[activeSection]}
//             </h1>
//           </div>
//           <div className="flex items-center gap-2 px-3.5 py-2 bg-green-50 border border-black/[0.07] rounded-xl text-sm font-medium text-gray-600">
//             <Store size={14} className="text-green-600" />
//             <span>{seller?.shop?.shopName || "No Shop"}</span>
//             <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(22,163,74,0.2)] animate-pulse" />
//           </div>
//         </header>

//         {/* Content */}
//         <div className="flex-1 p-8">
//           {/* ── DASHBOARD ── */}
//           {activeSection === "dashboard" && (
//             <>
//               <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
//                 <StatCard
//                   icon={<Package size={18} />}
//                   colorClass="green"
//                   label="Total Products"
//                   value={statistics.totalProducts}
//                   trend="Listed"
//                 />
//                 <StatCard
//                   icon={<Boxes size={18} />}
//                   colorClass="blue"
//                   label="Total Stock"
//                   value={statistics.totalStock}
//                   trend="Units"
//                 />
//                 <StatCard
//                   icon={<AlertTriangle size={18} />}
//                   colorClass="red"
//                   label="Out of Stock"
//                   value={statistics.outOfStock}
//                   trend="Restock"
//                 />
//                 <StatCard
//                   icon={<Wallet size={18} />}
//                   colorClass="amber"
//                   label="Inventory Value"
//                   value={`৳${statistics.totalInventoryValue.toLocaleString()}`}
//                   trend="Total"
//                 />
//                 <StatCard
//                   icon={<Layers3 size={18} />}
//                   colorClass="purple"
//                   label="Categories"
//                   value={statistics.activeCategories}
//                   trend="Active"
//                 />
//               </div>

//               <div className="grid grid-cols-3 xl:grid-cols-3 gap-4">
//                 <InfoCard
//                   icon={<Store size={16} />}
//                   label="Shop Name"
//                   value={seller?.shop?.shopName || "No Shop"}
//                 />
//                 <InfoCard
//                   icon={<MapPin size={16} />}
//                   label="Shop Address"
//                   value={seller?.shop?.shopAddress || "No Address"}
//                 />
//                 <InfoCard
//                   icon={<BadgeCheck size={16} />}
//                   label="Trade License"
//                   value={seller?.shop?.tradeLicense || "N/A"}
//                 />
//               </div>
//             </>
//           )}

//           {/* ── PRODUCTS ── */}
//           {activeSection === "products" && (
//             <div className="grid grid-cols-[340px_1fr] xl:grid-cols-[340px_1fr] gap-5 items-start">
//               {/* Form card */}
//               <div className="bg-white border border-black/[0.07] rounded-2xl p-6">
//                 <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-5">
//                   <Plus size={17} className="text-green-600" />
//                   {editingProductId ? "Edit Product" : "New Product"}
//                 </h2>

//                 <form
//                   onSubmit={handleSubmitProduct}
//                   className="flex flex-col gap-3.5"
//                 >
//                   <div>
//                     <label className={labelCls}>Product Name</label>
//                     <input
//                       className={inputCls}
//                       type="text"
//                       name="productName"
//                       placeholder="e.g. Wireless Headphones"
//                       value={form.productName}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div>
//                     <label className={labelCls}>Category</label>
//                     <select
//                       className={inputCls}
//                       name="category"
//                       value={form.category}
//                       onChange={(e) =>
//                         setForm((prev) => ({
//                           ...prev,
//                           category: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="">Select Category</option>
//                       {PRODUCT_CATEGORIES.map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className={labelCls}>Description</label>
//                     <textarea
//                       className={`${inputCls} resize-y min-h-[90px]`}
//                       name="description"
//                       placeholder="Describe the product..."
//                       value={form.description}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className={labelCls}>Price (৳)</label>
//                       <input
//                         className={inputCls}
//                         type="number"
//                         name="price"
//                         placeholder="0.00"
//                         value={form.price}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div>
//                       <label className={labelCls}>Quantity</label>
//                       <input
//                         className={inputCls}
//                         type="number"
//                         name="quantity"
//                         placeholder="0"
//                         value={form.quantity}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>

//                   <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer text-center hover:border-green-500 hover:bg-green-50 transition group">
//                     <Upload
//                       size={20}
//                       className="text-gray-400 group-hover:text-green-600 transition"
//                     />
//                     <span className="text-[13px] font-medium text-gray-500">
//                       {productImage
//                         ? productImage.name
//                         : "Upload Product Image"}
//                     </span>
//                     <span className="text-[11px] text-gray-400">
//                       PNG, JPG, WEBP accepted
//                     </span>
//                     <input
//                       hidden
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) =>
//                         setProductImage(e.target.files?.[0] || null)
//                       }
//                     />
//                   </label>

//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition hover:shadow-lg hover:shadow-green-200"
//                   >
//                     {submitting
//                       ? "Saving..."
//                       : editingProductId
//                         ? "Update Product"
//                         : "Create Product"}
//                   </button>

//                   {editingProductId && (
//                     <button
//                       type="button"
//                       onClick={resetForm}
//                       className="w-full flex items-center justify-center text-sm font-semibold text-gray-500 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </form>
//               </div>

//               {/* Product list */}
//               <div className="bg-white border border-black/[0.07] rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
//                     My Products
//                   </h2>
//                   <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
//                     {products.length} items
//                   </span>
//                 </div>

//                 {productsLoading ? (
//                   <div className="flex items-center justify-center gap-1.5 py-10">
//                     {[0, 200, 400].map((delay) => (
//                       <span
//                         key={delay}
//                         className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
//                         style={{ animationDelay: `${delay}ms` }}
//                       />
//                     ))}
//                   </div>
//                 ) : products.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
//                     <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
//                       <Package size={28} />
//                     </div>
//                     <p className="text-lg font-bold text-gray-800">
//                       No Products Yet
//                     </p>
//                     <p className="text-sm text-gray-400">
//                       Create your first product using the form.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
//                     {products.map((product) => (
//                       <ProductCard
//                         key={product.id}
//                         product={product}
//                         onEdit={handleEdit}
//                         onDelete={handleDelete}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── ORDERS ── */}
//           {activeSection === "orders" && (
//             <div className="bg-white border border-black/[0.07] rounded-2xl p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-black text-gray-900">
//                     Seller Orders
//                   </h2>

//                   <p className="text-sm text-gray-500 mt-1">
//                     Orders containing your products
//                   </p>
//                 </div>

//                 <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
//                   <p className="text-sm font-bold text-green-700">
//                     {orders.length} Orders
//                   </p>
//                 </div>
//               </div>

//               {ordersLoading ? (
//                 <div className="flex items-center justify-center py-20">
//                   <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
//                 </div>
//               ) : orders.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
//                   <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
//                     <ShoppingBag size={32} />
//                   </div>

//                   <p className="text-xl font-bold text-gray-900">
//                     No Orders Found
//                   </p>

//                   <p className="text-sm text-gray-400 max-w-xs">
//                     Customers have not ordered your products yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-5">
//                   {orders.map((order: any) => (
//                     <div
//                       key={order.id}
//                       className="border border-black/[0.06] rounded-2xl overflow-hidden"
//                     >
//                       {/* TOP */}
//                       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 bg-gray-50 border-b border-black/[0.06]">
//                         <div>
//                           <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                             Order ID
//                           </p>

//                           <p className="text-lg font-black text-gray-900">
//                             #{order.id}
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                             Customer
//                           </p>

//                           <p className="font-bold text-gray-800">
//                             {order.customer?.name || "Unknown"}
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                             Payment
//                           </p>

//                           <p className="font-bold text-gray-800 capitalize">
//                             {order.paymentMethod}
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                             Status
//                           </p>

//                           <span
//                             className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border
//                     ${
//                       order.status === "pending"
//                         ? "bg-yellow-50 text-yellow-700 border-yellow-200"
//                         : order.status === "processing"
//                           ? "bg-blue-50 text-blue-700 border-blue-200"
//                           : order.status === "delivered"
//                             ? "bg-green-50 text-green-700 border-green-200"
//                             : "bg-red-50 text-red-700 border-red-200"
//                     }
//                   `}
//                           >
//                             {order.status}
//                           </span>
//                         </div>

//                         <div>
//                           <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                             Total
//                           </p>

//                           <p className="text-lg font-black text-green-600">
//                             ৳{Number(order.totalAmount).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>

//                       {/* ITEMS */}
//                       <div className="divide-y divide-black/[0.06]">
//                         {order.orderItems?.map((item: OrderItem) => (
//                           <div
//                             key={item.id}
//                             className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4"
//                           >
//                             {/* LEFT SIDE */}
//                             <div className="flex items-center gap-4">
//                               <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-black/[0.06]">
//                                 {item.product?.productImage ? (
//                                   <img
//                                     src={`${API_BASE_URL}/uploads/products/${item.product.productImage}`}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                     <ShoppingBag size={22} />
//                                   </div>
//                                 )}
//                               </div>

//                               <div>
//                                 <p className="font-bold text-gray-900">
//                                   {item.product?.productName}
//                                 </p>

//                                 <p className="text-sm text-gray-400">
//                                   Category: {item.product?.category}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* RIGHT SIDE */}
//                             <div className="flex items-center gap-8">
//                               <div>
//                                 <p className="text-xs uppercase text-gray-400 font-semibold">
//                                   Quantity
//                                 </p>
//                                 <p className="font-bold">{item.quantity}</p>
//                               </div>

//                               <div>
//                                 <p className="text-xs uppercase text-gray-400 font-semibold">
//                                   Price
//                                 </p>
//                                 <p className="font-bold">
//                                   ৳{Number(item.price).toLocaleString()}
//                                 </p>
//                               </div>

//                               <div>
//                                 <p className="text-xs uppercase text-gray-400 font-semibold">
//                                   Status
//                                 </p>

//                                 <span
//                                   className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border
//             ${
//               item.status === "pending"
//                 ? "bg-yellow-50 text-yellow-700 border-yellow-200"
//                 : item.status === "processing"
//                   ? "bg-blue-50 text-blue-700 border-blue-200"
//                   : item.status === "accepted"
//                     ? "bg-green-50 text-green-700 border-green-200"
//                     : "bg-red-50 text-red-700 border-red-200"
//             }
//           `}
//                                 >
//                                   {item.status}
//                                 </span>
//                               </div>

//                               {/* ACTION BUTTONS */}
//                               <div className="flex flex-col gap-2">
//                                 <button
//                                   onClick={() =>
//                                     updateOrderItemStatus(item.id, "accepted")
//                                   }
//                                   className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-lg"
//                                 >
//                                   Accept
//                                 </button>

//                                 <button
//                                   onClick={() =>
//                                     updateOrderItemStatus(item.id, "rejected")
//                                   }
//                                   className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-lg"
//                                 >
//                                   Reject
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* FOOTER */}
//                       <div className="px-5 py-3 bg-gray-50 border-t border-black/[0.06] flex justify-between items-center">
//                         <p className="text-sm text-gray-500">
//                           Ordered on{" "}
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </p>

//                         <p className="text-sm font-bold text-gray-700 capitalize">
//                           {order.orderItems?.length} item(s)
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── PROFILE ── */}
//           {activeSection === "profile" && (
//             <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
//               {/* Edit form */}
//               <div className="bg-white border border-black/[0.07] rounded-2xl p-6">
//                 <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-6">
//                   Edit Profile
//                 </h2>

//                 <form
//                   onSubmit={handleUpdateProfile}
//                   className="flex flex-col gap-4"
//                 >
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className={labelCls}>Full Name</label>
//                       <input
//                         className={inputCls}
//                         type="text"
//                         name="name"
//                         value={profileForm.name}
//                         onChange={handleProfileChange}
//                         placeholder="Your name"
//                       />
//                     </div>
//                     <div>
//                       <label className={labelCls}>Email</label>
//                       <input
//                         className={inputCls}
//                         type="email"
//                         name="email"
//                         value={profileForm.email}
//                         onChange={handleProfileChange}
//                         placeholder="Email address"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className={labelCls}>Phone</label>
//                       <input
//                         className={inputCls}
//                         type="text"
//                         name="phone"
//                         value={profileForm.phone}
//                         onChange={handleProfileChange}
//                         placeholder="+880..."
//                       />
//                     </div>
//                     <div>
//                       <label className={labelCls}>NID Number</label>
//                       <input
//                         className={inputCls}
//                         type="text"
//                         name="nidNumber"
//                         value={profileForm.nidNumber}
//                         onChange={handleProfileChange}
//                         placeholder="NID number"
//                       />
//                     </div>
//                   </div>

//                   <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer text-center hover:border-green-500 hover:bg-green-50 transition group">
//                     <Upload
//                       size={20}
//                       className="text-gray-400 group-hover:text-green-600 transition"
//                     />
//                     <span className="text-[13px] font-medium text-gray-500">
//                       {profileImage ? profileImage.name : "Upload NID Image"}
//                     </span>
//                     <span className="text-[11px] text-gray-400">
//                       Clear photo of your NID card
//                     </span>
//                     <input
//                       hidden
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) =>
//                         setProfileImage(e.target.files?.[0] || null)
//                       }
//                     />
//                   </label>

//                   <button
//                     type="submit"
//                     disabled={profileUpdating}
//                     className="w-fit flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-xl transition hover:shadow-lg hover:shadow-green-200"
//                   >
//                     {profileUpdating ? "Saving..." : "Save Changes"}
//                   </button>
//                 </form>
//               </div>

//               {/* Preview card */}
//               <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col items-center text-center gap-3">
//                 <img
//                   src={
//                     seller?.nidImage
//                       ? `${API_BASE_URL}/uploads/${seller.nidImage}`
//                       : "/avatar.png"
//                   }
//                   alt="avatar"
//                   className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100"
//                 />
//                 <div>
//                   <p className="text-lg font-bold text-gray-900">
//                     {seller?.name || "—"}
//                   </p>
//                   <p className="text-sm text-gray-400">
//                     {seller?.email || "—"}
//                   </p>
//                 </div>

//                 <div className="w-full mt-1 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
//                   {[
//                     { label: "Phone", value: seller?.phone },
//                     { label: "NID", value: seller?.nidNumber },
//                     { label: "Shop", value: seller?.shop?.shopName },
//                     { label: "License", value: seller?.shop?.tradeLicense },
//                   ].map(({ label, value }) => (
//                     <div
//                       key={label}
//                       className="flex items-center justify-between text-sm"
//                     >
//                       <span className="text-gray-400">{label}</span>
//                       <span className="font-medium text-gray-800">
//                         {value || "—"}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ── SUB-COMPONENTS ── */

// function StatCard({
//   icon,
//   colorClass,
//   label,
//   value,
//   trend,
// }: {
//   icon: React.ReactNode;
//   colorClass: "green" | "blue" | "red" | "amber" | "purple";
//   label: string;
//   value: string | number;
//   trend: string;
// }) {
//   return (
//     <div className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3.5 hover:-translate-y-0.5 hover:border-black/[0.13] transition-all cursor-default">
//       <div className="flex items-center justify-between">
//         <div
//           className={`w-10 h-10 rounded-xl flex items-center justify-center ${statIconClasses[colorClass]}`}
//         >
//           {icon}
//         </div>
//         <span className="text-[11px] font-semibold px-2 py-1 rounded-md bg-green-50 text-green-600">
//           {trend}
//         </span>
//       </div>
//       <div>
//         <p className="text-[28px] font-extrabold text-gray-900 leading-none tracking-tight">
//           {value}
//         </p>
//         <p className="text-xs font-medium text-gray-400 mt-1">{label}</p>
//       </div>
//     </div>
//   );
// }

// function InfoCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="bg-white border border-black/[0.07] rounded-2xl px-5 py-4 flex items-center gap-3.5 hover:border-black/[0.13] transition-all">
//       <div className="w-10 h-10 rounded-xl bg-green-50 border border-black/[0.07] flex items-center justify-center text-green-600 flex-shrink-0">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[11px] font-medium text-gray-400 mb-1">{label}</p>
//         <p className="text-sm font-semibold text-gray-800">{value}</p>
//       </div>
//     </div>
//   );
// }

// function ProductCard({
//   product,
//   onEdit,
//   onDelete,
// }: {
//   product: Product;
//   onEdit: (product: Product) => void;
//   onDelete: (id: number) => void;
// }) {
//   const imageUrl = product.productImage
//     ? `${API_BASE_URL}/uploads/products/${product.productImage}`
//     : "";

//   const qty = Number(product.quantity);
//   const stockBadge =
//     qty <= 0
//       ? { label: "Out of Stock", cls: "bg-red-50 text-red-500" }
//       : qty <= 5
//         ? { label: `Low: ${qty}`, cls: "bg-amber-50 text-amber-600" }
//         : { label: `${qty} in stock`, cls: "bg-green-50 text-green-600" };

//   return (
//     <div className="bg-green-50/50 border border-black/[0.07] rounded-2xl overflow-hidden hover:border-black/[0.13] hover:-translate-y-0.5 transition-all">
//       <div className="h-40 bg-white flex items-center justify-center relative overflow-hidden">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={product.productName}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <Package size={36} className="text-gray-300" />
//         )}
//         <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-black/60 text-green-400 backdrop-blur-sm border border-green-600/30">
//           {product.category}
//         </span>
//       </div>

//       <div className="p-4">
//         <p className="text-[15px] font-bold text-gray-900 truncate mb-1.5">
//           {product.productName}
//         </p>
//         <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
//           {product.description || "No description provided."}
//         </p>

//         <div className="flex items-center justify-between mb-3">
//           <span className="text-lg font-extrabold text-green-600">
//             ৳{Number(product.price).toLocaleString()}
//           </span>
//           <span
//             className={`text-xs font-semibold px-2 py-1 rounded-md ${stockBadge.cls}`}
//           >
//             {stockBadge.label}
//           </span>
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={() => onEdit(product)}
//             className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition"
//           >
//             <Pencil size={12} /> Edit
//           </button>
//           <button
//             onClick={() => onDelete(product.id)}
//             className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
//           >
//             <Trash2 size={12} /> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // seller / page.tsx;

// // "use client";

// // import DashboardPage from "./DashboardPage";

// // export default function Page() {
// //   return <DashboardPage />;
// // }

// import DashboardSection from "./DashboardSection";
// import ProductsSection from "./ProductsSection";
// import OrdersSection from "./OrdersSection";
// import ProfileSection from "./ProfileSection";

// `app/seller/dashboard/page.tsx`

// ("use client");

import Pusher from "pusher-js";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  LogOut,
  Store,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import DashboardSection from "./DashboardSection";
import ProductsSection from "./ProductsSection";
import OrdersSection from "./OrdersSection";
import ProfileSection from "./ProfileSection";

export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
];

export type SellerShop = {
  id: number;
  shopName: string;
  shopAddress: string;
  tradeLicense: string;
};

export type Seller = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  nidNumber?: string;
  nidImage?: string | null;
  shop?: SellerShop | null;
};

export type Product = {
  id: number;
  productName: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  productImage?: string | null;
};

export type OrderItem = {
  id: number;
  quantity: number;
  price: number;

  status: "pending" | "accepted" | "rejected" | "processing";

  product?: {
    id: number;
    productName: string;
    category: string;
    productImage?: string | null;
  };
};

export type Order = {
  id: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;

  customer?: {
    id: number;
    name: string;
  };

  orderItems?: OrderItem[];
};

export type ProductForm = {
  productName: string;
  category: string;
  description: string;
  price: string;
  quantity: string;
};

export type SellerProfileForm = {
  name: string;
  email: string;
  phone: string;
  nidNumber: string;
};

export const emptyForm: ProductForm = {
  productName: "",
  category: "",
  description: "",
  price: "",
  quantity: "",
};

export const emptyProfileForm: SellerProfileForm = {
  name: "",
  email: "",
  phone: "",
  nidNumber: "",
};

const sectionTitles: Record<string, string> = {
  dashboard: "Overview",
  products: "Manage Products",
  orders: "Orders",
  profile: "Seller Profile",
};

export default function SellerDashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "products" | "orders" | "profile"
  >("dashboard");

  const [seller, setSeller] = useState<Seller | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [profileForm, setProfileForm] =
    useState<SellerProfileForm>(emptyProfileForm);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileUpdating, setProfileUpdating] = useState(false);

  const statistics = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, p) => sum + Number(p.quantity || 0),
      0,
    );

    const outOfStock = products.filter((p) => Number(p.quantity) <= 0).length;

    const totalInventoryValue = products.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
      0,
    );

    const activeCategories = new Set(
      products.map((p) => p.category).filter(Boolean),
    ).size;

    return {
      totalProducts,
      totalStock,
      outOfStock,
      totalInventoryValue,
      activeCategories,
    };
  }, [products]);

  useEffect(() => {
    const pusher = new Pusher(
      "8ce8e1219e4b306f5eba",

      {
        cluster: "ap2",
      },
    );

    const channel = pusher.subscribe("seller-channel");

    channel.bind(
      "new-order",

      (data: any) => {
        console.log(data);

        toast.success(`🛒 ${data.message}`);
      },
    );

    return () => {
      channel.unbind_all();

      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedSeller = Cookies.get("seller");

    if (!savedToken || !savedSeller) {
      toast.error("Please login first");
      window.location.href = "/login/seller";
      return;
    }

    try {
      const parsedSeller = JSON.parse(savedSeller) as Seller;

      setSeller(parsedSeller);

      setProfileForm({
        name: parsedSeller.name || "",
        email: parsedSeller.email || "",
        phone: parsedSeller.phone || "",
        nidNumber: parsedSeller.nidNumber || "",
      });

      loadSellerProducts(parsedSeller.id);
      loadSellerOrders(parsedSeller.id);
    } catch {
      Cookies.remove("token");
      Cookies.remove("seller");

      toast.error("Session expired");
      window.location.href = "/login/seller";
    }
  }, []);

  const loadSellerProducts = async (sellerId: number) => {
    try {
      setProductsLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/seller/${sellerId}/products`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      const productList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setProducts(productList);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  const loadSellerOrders = async (sellerId: number) => {
    try {
      setOrdersLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/seller/${sellerId}/orders`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      const orderList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setOrders(orderList);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("seller");

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/login/seller";
    }, 700);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setProductImage(null);
    setEditingProductId(null);
  };

  const handleSubmitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = Cookies.get("token");

    if (!token || !seller) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("productName", form.productName);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);

      if (productImage) {
        formData.append("productImage", productImage);
      }

      if (editingProductId) {
        await axios.patch(
          `${API_BASE_URL}/seller/products/${editingProductId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Product updated");
      } else {
        await axios.post(
          `${API_BASE_URL}/seller/${seller.id}/products`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Product created");
      }

      resetForm();
      loadSellerProducts(seller.id);
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setActiveSection("products");

    setEditingProductId(product.id);

    setForm({
      productName: product.productName,
      category: product.category,
      description: product.description || "",
      price: String(product.price),
      quantity: String(product.quantity),
    });
  };

  const handleDelete = async (productId: number) => {
    const token = Cookies.get("token");

    if (!token || !seller) return;

    if (!confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/seller/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product deleted");
      loadSellerProducts(seller.id);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = Cookies.get("token");

    if (!token || !seller) return;

    try {
      setProfileUpdating(true);

      const formData = new FormData();

      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      formData.append("phone", profileForm.phone);
      formData.append("nidNumber", profileForm.nidNumber);

      if (profileImage) {
        formData.append("nidImage", profileImage);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/seller/${seller.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedSeller = response.data?.data || response.data;

      setSeller(updatedSeller);

      Cookies.set("seller", JSON.stringify(updatedSeller), {
        expires: 1,
        sameSite: "lax",
      });

      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setProfileUpdating(false);
    }
  };

  const updateOrderItemStatus = async (
    orderItemId: number,
    status: "pending" | "accepted" | "rejected" | "processing",
  ) => {
    try {
      const token = Cookies.get("token");

      if (!token) return;

      await axios.patch(
        `${API_BASE_URL}/seller/order-items/${orderItemId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order item updated");

      if (seller) {
        loadSellerOrders(seller.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order item");
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen bg-green-50">
      <aside className="w-[260px] min-h-screen bg-[#0d3d24] flex flex-col flex-shrink-0 sticky top-0 px-5 py-7">
        <div className="flex items-center gap-3 px-2 pb-7 mb-6 border-b border-white/[0.08]">
          <div className="w-9 h-9 bg-green-400 rounded-xl flex items-center justify-center flex-shrink-0 text-[#0d3d24]">
            <TrendingUp size={18} />
          </div>

          {/* <span className="text-white font-bold text-lg tracking-tight">
            Nex<span className="text-green-400">Cart</span>
          </span> */}
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/30 px-2 mb-2">
          Navigation
        </p>

        <nav className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setActiveSection(item.id as typeof activeSection)
                }
                className={`relative flex items-center gap-3 w-full text-left px-3 py-[11px] rounded-xl text-sm font-medium transition-all
                ${isActive
                    ? "bg-green-400/15 text-green-400"
                    : "text-white/55 hover:bg-white/[0.08] hover:text-white"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-[20%] h-[60%] w-[3px] bg-green-400 rounded-r-full" />
                )}

                <Icon size={18} className="flex-shrink-0 opacity-90" />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5 pt-5 mt-5 border-t border-white/[0.08]">
          <img
            src={
              seller?.nidImage
                ? `${API_BASE_URL}/uploads/${seller.nidImage}`
                : "/avatar.png"
            }
            alt="avatar"
            className="w-9 h-9 rounded-xl object-cover border border-white/15 flex-shrink-0"
          />

          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-semibold text-white truncate">
              {seller?.name || "Seller"}
            </p>

            <p className="text-[11px] text-white/35">Seller Account</p>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/12 text-white/40 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all flex-shrink-0"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-black/[0.07] sticky top-0 z-10">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>NexCart</span>

              <ChevronRight size={13} />
              <span>{sectionTitles[activeSection]}</span>
            </div>

            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
              {sectionTitles[activeSection]}
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-green-50 border border-black/[0.07] rounded-xl text-sm font-medium text-gray-600">
            <Store size={14} className="text-green-600" />

            <span>{seller?.shop?.shopName || "No Shop"}</span>

            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(22,163,74,0.2)] animate-pulse" />
          </div>
        </header>

        <div className="flex-1 p-8">
          {activeSection === "dashboard" && (
            <DashboardSection seller={seller} statistics={statistics} />
          )}

          {activeSection === "products" && (
            <ProductsSection
              products={products}
              productsLoading={productsLoading}
              form={form}
              setForm={setForm}
              productImage={productImage}
              setProductImage={setProductImage}
              editingProductId={editingProductId}
              submitting={submitting}
              handleChange={handleChange}
              handleSubmitProduct={handleSubmitProduct}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              resetForm={resetForm}
            />
          )}

          {activeSection === "orders" && (
            <OrdersSection
              orders={orders}
              ordersLoading={ordersLoading}
              updateOrderItemStatus={updateOrderItemStatus}
            />
          )}

          {activeSection === "profile" && (
            <ProfileSection
              seller={seller}
              profileForm={profileForm}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              profileUpdating={profileUpdating}
              handleProfileChange={handleProfileChange}
              handleUpdateProfile={handleUpdateProfile}
            />
          )}
        </div>
      </main>
    </div>
  );
}
