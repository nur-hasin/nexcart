"use client";

import { Upload } from "lucide-react";

const inputCls =
  "w-full bg-green-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type Props = {
  seller: any;

  profileForm: any;
  handleProfileChange: any;

  handleUpdateProfile: any;

  profileImage: File | null;
  setProfileImage: any;

  profileUpdating: boolean;
};

export default function ProfileSection({
  seller,
  profileForm,
  handleProfileChange,
  handleUpdateProfile,
  profileImage,
  setProfileImage,
  profileUpdating,
}: Props) {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
      {/* Edit form */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-6">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-6">
          Edit Profile
        </h2>

        <form
          onSubmit={handleUpdateProfile}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Full Name</label>

              <input
                className={inputCls}
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className={labelCls}>Email</label>

              <input
                className={inputCls}
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Phone</label>

              <input
                className={inputCls}
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="+880..."
              />
            </div>

            <div>
              <label className={labelCls}>NID Number</label>

              <input
                className={inputCls}
                type="text"
                name="nidNumber"
                value={profileForm.nidNumber}
                onChange={handleProfileChange}
                placeholder="NID number"
              />
            </div>
          </div>

          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer text-center hover:border-green-500 hover:bg-green-50 transition group">
            <Upload
              size={20}
              className="text-gray-400 group-hover:text-green-600 transition"
            />

            <span className="text-[13px] font-medium text-gray-500">
              {profileImage
                ? profileImage.name
                : "Upload NID Image"}
            </span>

            <span className="text-[11px] text-gray-400">
              Clear photo of your NID card
            </span>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfileImage(e.target.files?.[0] || null)
              }
            />
          </label>

          <button
            type="submit"
            disabled={profileUpdating}
            className="w-fit flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-xl transition hover:shadow-lg hover:shadow-green-200"
          >
            {profileUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Preview card */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col items-center text-center gap-3">
        <img
          src={
            seller?.nidImage
              ? `${API_BASE_URL}/uploads/${seller.nidImage}`
              : "/avatar.png"
          }
          alt="avatar"
          className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100"
        />

        <div>
          <p className="text-lg font-bold text-gray-900">
            {seller?.name || "—"}
          </p>

          <p className="text-sm text-gray-400">
            {seller?.email || "—"}
          </p>
        </div>

        <div className="w-full mt-1 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
          {[
            { label: "Phone", value: seller?.phone },
            { label: "NID", value: seller?.nidNumber },
            { label: "Shop", value: seller?.shop?.shopName },
            { label: "License", value: seller?.shop?.tradeLicense },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-400">
                {label}
              </span>

              <span className="font-medium text-gray-800">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

