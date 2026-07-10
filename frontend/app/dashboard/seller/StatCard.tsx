import React from "react";

const statIconClasses: Record<string, string> = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-500",
  red: "bg-red-100 text-red-500",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-purple-100 text-purple-500",
};

export default function StatCard({
  icon,
  colorClass,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  colorClass: "green" | "blue" | "red" | "amber" | "purple";
  label: string;
  value: string | number;
  trend: string;
}) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3.5 hover:-translate-y-0.5 hover:border-black/[0.13] transition-all cursor-default">
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${statIconClasses[colorClass]}`}
        >
          {icon}
        </div>

        <span className="text-[11px] font-semibold px-2 py-1 rounded-md bg-green-50 text-green-600">
          {trend}
        </span>
      </div>

      <div>
        <p className="text-[28px] font-extrabold text-gray-900 leading-none tracking-tight">
          {value}
        </p>

        <p className="text-xs font-medium text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}
