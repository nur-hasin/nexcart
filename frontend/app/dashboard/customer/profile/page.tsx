"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Camera,
  User,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Pencil,
  CheckCircle,
} from "lucide-react";

export default function CustomerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "customer") {
      window.location.href = "/login/customer";
      return;
    }

    axios
      .get("http://localhost:3000/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData({ name: res.data.name || "", email: res.data.email || "" });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load profile");
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      if (profilePic) fd.append("profilePic", profilePic);

      const res = await axios.put(
        `http://localhost:3000/customer/profile/${user.id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
      setPreview(null);
      setProfilePic(null);
      setSaved(true);
      toast.success("Profile updated successfully 🎉");
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc =
    preview ||
    (user?.profilePic
      ? `http://localhost:3000/uploads/profile/${user.profilePic}?t=${Date.now()}`
      : null);

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">

        {/* ── Back link ── */}
        <a
          href="/dashboard/customer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </a>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

          {/* ── Banner ── */}
          <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
          </div>

          <div className="px-8 pb-8">

            {/* ── Avatar row ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-8">
              {/* Avatar */}
              <div className="relative w-fit">
                <div className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden bg-indigo-100 flex items-center justify-center">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-indigo-400">{initials ?? "?"}</span>
                  )}
                </div>

                {/* Camera button */}
                <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md transition-colors">
                  <Camera size={15} />
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              {/* Name + badge */}
              <div className="sm:mb-2">
                <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">
                  {user?.name ?? "—"}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck size={14} className="text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-500">Verified Customer</span>
                </div>
              </div>
            </div>

            {/* ── File preview pill ── */}
            {profilePic && (
              <div className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl w-fit text-sm text-indigo-700 font-medium">
                <Camera size={14} /> {profilePic.name}
                <button
                  onClick={() => { setProfilePic(null); setPreview(null); }}
                  className="ml-1 text-indigo-400 hover:text-indigo-700 font-bold"
                >×</button>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleUpdate} className="space-y-5">

              {/* Name */}
              <div className="group">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  <User size={13} /> Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-10 text-slate-800 font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-300"
                  />
                  <Pencil size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  <Mail size={13} /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-10 text-slate-800 font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-300"
                  />
                  <Pencil size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-2" />

              {/* Submit */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-indigo-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                {saved && (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold animate-pulse">
                    <CheckCircle size={16} /> Saved!
                  </div>
                )}
              </div>
            </form>

          </div>
        </div>

        {/* ── Info card below ── */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex items-center gap-3">
          <ShieldCheck size={18} className="text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-400">
            Your personal information is encrypted and never shared with third parties.
          </p>
        </div>

      </div>
    </div>
  );
}