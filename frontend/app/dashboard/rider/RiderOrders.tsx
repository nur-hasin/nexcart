// import React from "react";

// interface Order {
//   id: number;
//   status: string;
// }
// interface Delivery {
//   id: number;
//   status: string;

//   order: {
//     id: number;
//   };
// }

// interface Props {
//   orders: Order[];

//   deliveries: Delivery[];

//   updateOrderStatus: (orderId: number, status: string) => Promise<void>;

//   updateDeliveryStatus: (deliveryId: number, status: string) => Promise<void>;
// }
// const RiderOrders = ({
//   orders,
//   deliveries,
//   updateOrderStatus,
//   updateDeliveryStatus,
// }: Props) => {
//   const getStatusActions = (status: string) => {
//     switch (status) {
//       case "delivered":
//         return [];
//       case "processing":
//         return [
//           {
//             label: "Mark Delivered",
//             status: "delivered",
//             className: "bg-green-600 hover:bg-green-700",
//           },
//         ];
//       default:
//         return [
//           {
//             label: "Mark Processing",
//             status: "processing",
//             className: "bg-yellow-500 hover:bg-yellow-600",
//           },
//           {
//             label: "Mark Delivered",
//             status: "delivered",
//             className: "bg-green-600 hover:bg-green-700",
//           },
//         ];
//     }
//   };

//   const renderStatusBadge = (status: string) => {
//     const baseClasses =
//       "inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize";
//     if (status === "delivered") {
//       return (
//         <span className={`${baseClasses} bg-emerald-100 text-emerald-700`}>
//           {status}
//         </span>
//       );
//     }
//     if (status === "processing") {
//       return (
//         <span className={`${baseClasses} bg-yellow-100 text-amber-700`}>
//           {status}
//         </span>
//       );
//     }
//     return (
//       <span className={`${baseClasses} bg-slate-100 text-slate-700`}>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">
//       <h2 className="text-3xl font-black mb-8">Assigned Orders</h2>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b text-left">
//               <th className="pb-5">Order ID</th>
//               <th className="pb-5">Status</th>
//               <th className="pb-5">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length > 0 ? (
//               orders.map((order) => {
//                 const actions = getStatusActions(order.status);
//                 return (
//                   <tr key={order.id} className="border-b">
//                     <td className="py-5 font-semibold">#{order.id}</td>
//                     <td className="py-5">{renderStatusBadge(order.status)}</td>
//                     <td className="py-5">
//                       {actions.length > 0 ? (
//                         <div className="flex flex-wrap gap-3">
//                           {actions.map((action) => (
//                             <button
//                               key={action.label}
//                               onClick={() =>
//                                 updateOrderStatus(order.id, action.status)
//                               }
//                               className={`${action.className} text-white px-4 py-2 rounded-xl transition`}
//                             >
//                               {action.label}
//                             </button>
//                           ))}
//                         </div>
//                       ) : (
//                         <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
//                           Completed
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td className="py-8" colSpan={3}>
//                   No Orders Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">
//         <h2 className="text-3xl font-black mb-8">Delivery Requests</h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b text-left">
//                 <th className="pb-5">Delivery ID</th>
//                 <th className="pb-5">Order ID</th>
//                 <th className="pb-5">Status</th>
//                 <th className="pb-5">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {deliveries.length > 0 ? (
//                 deliveries.map((delivery) => (
//                   <tr key={delivery.id} className="border-b">
//                     <td className="py-5 font-semibold">#{delivery.id}</td>

//                     <td className="py-5">#{delivery.order?.id}</td>

//                     <td className="py-5 capitalize">{delivery.status}</td>

//                     <td className="py-5">
//                       {delivery.status === "pending" ? (
//                         <div className="flex gap-3">
//                           <button
//                             onClick={() =>
//                               updateDeliveryStatus(delivery.id, "accepted")
//                             }
//                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
//                           >
//                             Accept
//                           </button>

//                           <button
//                             onClick={() =>
//                               updateDeliveryStatus(delivery.id, "rejected")
//                             }
//                             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       ) : (
//                         <span className="capitalize font-semibold">
//                           {delivery.status}
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-8" colSpan={4}>
//                     No Delivery Requests
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RiderOrders;

import React from "react";

interface Delivery {
  id: number;
  status: string;

  order: {
    id: number;
    status: string;
  };
}

interface Props {
  deliveries: Delivery[];

  updateDeliveryStatus: (deliveryId: number, status: string) => Promise<void>;

  markDelivered: (deliveryId: number) => Promise<void>;
}
const RiderOrders = ({
  deliveries,
  updateDeliveryStatus,
  markDelivered,
}: Props) => {
  // =========================
  // FILTER DATA
  // =========================

  const acceptedOrders = deliveries.filter(
    (d) => d.status === "accepted" && d.order.status !== "delivered",
  );

  const pendingRequests = deliveries.filter((d) => d.status === "pending");

  const rejectedRequests = deliveries.filter((d) => d.status === "rejected");

  // =========================
  // STATUS BADGE
  // =========================
  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize";

    if (status === "accepted") {
      return (
        <span className={`${base} bg-green-100 text-green-700`}>accepted</span>
      );
    }

    if (status === "rejected") {
      return (
        <span className={`${base} bg-red-100 text-red-700`}>rejected</span>
      );
    }

    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>pending</span>
    );
  };

  return (
    <div className="space-y-10 mt-10">
      {/* =========================
          ACCEPTED ORDERS TABLE
      ========================= */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-black mb-8">Assigned Orders (Accepted)</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-5">Order ID</th>
                <th className="pb-5">Status</th>
              </tr>
            </thead>

            <tbody>
              {acceptedOrders.length > 0 ? (
                acceptedOrders.map((d) => (
                  <tr key={d.id} className="border-b">
                    <td className="py-5 font-semibold">#{d.order.id}</td>

                    <td className="py-5 flex items-center gap-4">
                      {renderStatusBadge(d.order.status)}

                      <button
                        onClick={() => markDelivered(d.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                      >
                        Mark Delivered
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-8">
                    No Accepted Orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          DELIVERY REQUESTS TABLE
      ========================= */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-black mb-8">Delivery Requests</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-5">Delivery ID</th>
                <th className="pb-5">Order ID</th>
                <th className="pb-5">Status</th>
                <th className="pb-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((d) => (
                  <tr key={d.id} className="border-b">
                    <td className="py-5 font-semibold">#{d.id}</td>

                    <td className="py-5">#{d.order.id}</td>

                    <td className="py-5">
                      {renderStatusBadge(d.order.status)}
                    </td>

                    <td className="py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateDeliveryStatus(d.id, "accepted")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => updateDeliveryStatus(d.id, "rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8">
                    No Delivery Requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiderOrders;
