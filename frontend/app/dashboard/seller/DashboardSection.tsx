"use client";

import Pusher from "pusher-js";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
  Layers3,
  Store,
  MapPin,
  BadgeCheck,
} from "lucide-react";

import StatCard from "./StatCard";
import InfoCard from "./InfoCard";

type Props = {
  statistics: any;
  seller: any;
};

export default function DashboardSection({ statistics, seller }: Props) {
  // useEffect(() => {
  //   const pusher = new Pusher(
  //     "8ce8e1219e4b306f5eba",

  //     {
  //       cluster: "ap2",
  //     },
  //   );

  //   const channel = pusher.subscribe("seller-channel");
  // });
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
        <StatCard
          icon={<Package size={18} />}
          colorClass="green"
          label="Total Products"
          value={statistics.totalProducts}
          trend="Listed"
        />

        <StatCard
          icon={<Boxes size={18} />}
          colorClass="blue"
          label="Total Stock"
          value={statistics.totalStock}
          trend="Units"
        />

        <StatCard
          icon={<AlertTriangle size={18} />}
          colorClass="red"
          label="Out of Stock"
          value={statistics.outOfStock}
          trend="Restock"
        />

        <StatCard
          icon={<Wallet size={18} />}
          colorClass="amber"
          label="Inventory Value"
          value={`৳${statistics.totalInventoryValue.toLocaleString()}`}
          trend="Total"
        />

        <StatCard
          icon={<Layers3 size={18} />}
          colorClass="purple"
          label="Categories"
          value={statistics.activeCategories}
          trend="Active"
        />
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-3 gap-4">
        <InfoCard
          icon={<Store size={16} />}
          label="Shop Name"
          value={seller?.shop?.shopName || "No Shop"}
        />

        <InfoCard
          icon={<MapPin size={16} />}
          label="Shop Address"
          value={seller?.shop?.shopAddress || "No Address"}
        />

        <InfoCard
          icon={<BadgeCheck size={16} />}
          label="Trade License"
          value={seller?.shop?.tradeLicense || "N/A"}
        />
      </div>
    </>
  );
}
