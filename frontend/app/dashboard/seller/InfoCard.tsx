import React from "react";

export default function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl px-5 py-4 flex items-center gap-3.5 hover:border-black/[0.13] transition-all">
      <div className="w-10 h-10 rounded-xl bg-green-50 border border-black/[0.07] flex items-center justify-center text-green-600 flex-shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-medium text-gray-400 mb-1">{label}</p>

        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
