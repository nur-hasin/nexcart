"use client";
import { ShoppingBag } from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type Props = {
  orders: any[];
  ordersLoading: boolean;
  updateOrderItemStatus: any;
};

export default function OrdersSection({
  orders,
  ordersLoading,
  updateOrderItemStatus,
}: Props) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Seller Orders</h2>

          <p className="text-sm text-gray-500 mt-1">
            Orders containing your products
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm font-bold text-green-700">
            {orders.length} Orders
          </p>
        </div>
      </div>

      {ordersLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
            <ShoppingBag size={32} />
          </div>

          <p className="text-xl font-bold text-gray-900">No Orders Found</p>

          <p className="text-sm text-gray-400 max-w-xs">
            Customers have not ordered your products yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="border border-black/[0.06] rounded-2xl overflow-hidden"
            >
              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 bg-gray-50 border-b border-black/[0.06]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Order ID
                  </p>

                  <p className="text-lg font-black text-gray-900">
                    #{order.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer
                  </p>

                  <p className="font-bold text-gray-800">
                    {order.customer?.name || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Payment
                  </p>

                  <p className="font-bold text-gray-800 capitalize">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </p>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border
                    ${order.status === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : order.status === "processing"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : order.status === "delivered"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }
                  `}
                  >
                    {order.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Total
                  </p>

                  <p className="text-lg font-black text-green-600">
                    ৳{Number(order.totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="divide-y divide-black/[0.06]">
                {order.orderItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-black/[0.06]">
                        {item.product?.productImage ? (
                          <img
                            src={`${API_BASE_URL}/uploads/products/${item.product.productImage}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag size={22} />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-gray-900">
                          {item.product?.productName}
                        </p>

                        <p className="text-sm text-gray-400">
                          Category: {item.product?.category}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs uppercase text-gray-400 font-semibold">
                          Quantity
                        </p>

                        <p className="font-bold">{item.quantity}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-400 font-semibold">
                          Price
                        </p>

                        <p className="font-bold">
                          ৳{Number(item.price).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-400 font-semibold">
                          Status
                        </p>

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border
                          ${item.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : item.status === "processing"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : item.status === "accepted"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }
                        `}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {item.status !== "accepted" && (
                          <button
                            onClick={() =>
                              updateOrderItemStatus(item.id, "accepted")
                            }
                            className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-lg"
                          >
                            Accept
                          </button>
                        )}

                        {item.status !== "rejected" && (
                          <button
                            onClick={() =>
                              updateOrderItemStatus(item.id, "rejected")
                            }
                            className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-lg"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="px-5 py-3 bg-gray-50 border-t border-black/[0.06] flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="text-sm font-bold text-gray-700 capitalize">
                  {order.orderItems?.length} item(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
