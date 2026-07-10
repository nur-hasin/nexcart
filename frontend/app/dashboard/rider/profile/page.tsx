"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import RiderProfileSection from "../RiderProfileSection";

const RiderProfilePage = () => {
  const [rider, setRider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // IMAGE FILE
  const [profileFile, setProfileFile] = useState<File | null>(null);

  // IMAGE PREVIEW
  const [previewImage, setPreviewImage] = useState("");

  const token = Cookies.get("token") || "";
  const role = Cookies.get("role");

  interface JwtPayload {
    sub: number;
    email: string;
  }

  let riderId: number | null = null;

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    riderId = decoded.sub;
  }

  const API = "http://localhost:3000/riders";

  // =========================================
  // AUTH CHECK
  // =========================================
  useEffect(() => {
    if (!token || role !== "rider") {
      window.location.href = "/login/rider";
    } else {
      fetchProfileData();
    }
  }, []);

  // =========================================
  // FETCH DATA
  // =========================================
  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const riderRes = await axios.get(`${API}/${riderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRider(riderRes.data);

      if (riderRes.data?.profileImage) {
        setPreviewImage(`http://localhost:3000/uploads/riders/${riderRes.data.profileImage}`);
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // IMAGE CHANGE
  // =========================================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  // =========================================
  // UPDATE PROFILE
  // =========================================
  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", rider.name);
      formData.append("phone", rider.phone);
      formData.append("vehicle_type", rider.vehicle_type);
      formData.append("current_location", rider.current_location);

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      await axios.put(`${API}/${riderId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
      fetchProfileData();
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================
  const changePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await axios.patch(
        `${API}/${riderId}/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Password updated successfully.");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password update failed.");
    }
  };

  // =========================================
  // CHANGE STATUS
  // =========================================
  const changeStatus = async (status: string) => {
    try {
      await axios.patch(`${API}/${riderId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Status updated");
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status failed");
    }
  };

  // =========================================
  // DELETE PROFILE
  // =========================================
  const deleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${API}/${riderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Cookies.remove("token");
      Cookies.remove("role");
      toast.success("Profile deleted successfully");
      window.location.href = "/login/rider";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="bg-white px-10 py-6 rounded-3xl shadow-lg text-2xl font-bold">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900">Rider Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-md"
          >
            Edit Profile
          </button>
        )}
      </div>

      <RiderProfileSection
        rider={rider}
        previewImage={previewImage}
        handleImageChange={handleImageChange}
        setRider={setRider}
        updateProfile={updateProfile}
        changeStatus={changeStatus}
        deleteProfile={deleteProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isChangingPassword={isChangingPassword}
        setIsChangingPassword={setIsChangingPassword}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        changePassword={changePassword}
      />
    </div>
  );
};

export default RiderProfilePage;