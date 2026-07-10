"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  CreditCard,
} from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const customerId = payload.sub;

      const res = await axios.post(
        `http://localhost:3000/customer/orders/${customerId}`,
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log(res.data);
      toast.success("Order placed successfully 🎉");
      setCartItems([]);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = Cookies.get("token");
        const role = Cookies.get("role");

        if (!token || role !== "customer") {
          window.location.href = "/login/customer";
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const customerId = payload.sub;

        const res = await axios.get(
          `http://localhost:3000/customer/cart/${customerId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setCartItems(res.data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://localhost:3000/customer/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (id: number, delta: number) => {
    try {
      const token = Cookies.get("token");
      const item = cartItems.find((i) => i.id === id);
      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) return;

      await axios.patch(
        `http://localhost:3000/customer/cart/${id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * Number(item.quantity),
    0,
  );

  const paymentOptions = [
    { value: "cash", label: "Cash on Delivery", emoji: "💵" },
    { value: "bkash", label: "bKash", emoji: "📱" },
    { value: "nagad", label: "Nagad", emoji: "🔴" },
    { value: "card", label: "Card Payment", emoji: "💳" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-semibold text-lg tracking-wide">
          Loading your cart…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200">
            <ShoppingCart size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">
              My Cart
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {cartItems.length === 0
                ? "No items"
                : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* ── Empty State ── */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 py-20 flex flex-col items-center gap-4">
            <div className="bg-indigo-50 p-6 rounded-full">
              <ShoppingCart size={48} className="text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700">
              Your cart is empty
            </h2>
            <p className="text-slate-400 text-sm">
              Add some products to get started.
            </p>
            <a
              href="/products"
              className="mt-2 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* ── Cart Items ── */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-4 transition-all hover:shadow-md group"
                >
                  {/* Product Image */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        item.product?.productImage
                          ? `http://localhost:3000/uploads/products/${item.product.productImage}`
                          : "/no-image.png"
                      }
                      alt={item.product?.productName}
                      className="w-24 h-24 rounded-xl object-cover bg-slate-100"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base truncate">
                      {item.product?.productName}
                    </h3>
                    <p className="text-indigo-600 font-extrabold text-lg mt-1">
                      $
                      {(
                        Number(item.product?.price) * Number(item.quantity)
                      ).toFixed(2)}
                    </p>
                    <p className="text-slate-400 text-xs">
                      ${Number(item.product?.price).toFixed(2)} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} className="text-slate-600" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-700 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} className="text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="shrink-0 p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div className="w-full lg:w-80 shrink-0 sticky top-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-5">
                <h2 className="text-lg font-extrabold text-slate-800">
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="flex flex-col gap-2 text-sm text-slate-500 border-b border-slate-100 pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="truncate max-w-[160px]">
                        {item.product?.productName} × {item.quantity}
                      </span>
                      <span className="font-semibold text-slate-700">
                        $
                        {(
                          Number(item.product?.price) * Number(item.quantity)
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag size={16} className="text-indigo-500" /> Total
                  </span>
                  <span className="text-2xl font-extrabold text-indigo-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <CreditCard size={14} /> Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPaymentMethod(opt.value)}
                        className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all
                          ${
                            paymentMethod === opt.value
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                              : "border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50"
                          }`}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {checkingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    "Place Order →"
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Secure checkout · Free returns
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
