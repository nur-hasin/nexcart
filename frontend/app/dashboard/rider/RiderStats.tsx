import React from "react";

interface Props {
  totalDeliveries: number;
  pendingOrders: number;
  completedOrders: number;
}

const RiderStats = ({ totalDeliveries, pendingOrders, completedOrders }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-slate-500 text-lg">Total Deliveries</h2>
        <h1 className="text-5xl font-black text-slate-900 mt-4">{totalDeliveries}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-slate-500 text-lg">Pending Orders</h2>
        <h1 className="text-5xl font-black text-yellow-500 mt-4">{pendingOrders}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-slate-500 text-lg">Completed Orders</h2>
        <h1 className="text-5xl font-black text-green-600 mt-4">{completedOrders}</h1>
      </div>
    </div>
  );
};

export default RiderStats;
