"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import RiderStats from "./RiderStats";
import RiderOrders from "./RiderOrders";
import RiderReviews from "./RiderReviews";

const RiderDashboard = () => {
  const [rider, setRider] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const API = `${process.env.NEXT_PUBLIC_API_URL}/riders`;

  // =========================================
  // AUTH CHECK
  // =========================================
  useEffect(() => {
    if (!token || role !== "rider") {
      window.location.href = "/login/rider";
    } else {
      fetchDashboardData();
    }
  }, []);

  // =========================================
  // FETCH DATA
  // =========================================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // RIDER PROFILE
      const riderRes = await axios.get(`${API}/${riderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRider(riderRes.data);
      console.log(riderRes.data, "ddddd");
      // IMAGE PREVIEW
      if (riderRes.data?.profileImage) {
        setPreviewImage(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/riders/${riderRes.data.profileImage}`,
        );
      }

      // REVIEWS
      const reviewRes = await axios.get(`${API}/${riderId}/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(reviewRes.data);

      // ORDERS
      try {
        const acceptedRes = await axios.get(`${API}/${riderId}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(acceptedRes.data);
        try {
          const deliveryRes = await axios.get(`${API}/${riderId}/deliveries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setDeliveries(deliveryRes.data);
        } catch {
          console.log("Deliveries route missing");
        }
      } catch {
        console.log("Orders route missing");
      }
    } catch {
      toast.error("Failed to load dashboard");
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

    // PREVIEW
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

      // IMAGE FILE
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

      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // =========================================
  // CHANGE STATUS
  // =========================================
  const changeStatus = async (status: string) => {
    try {
      await axios.patch(
        `${API}/${riderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Status updated");

      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status failed");
    }
  };

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await axios.patch(
        `${API}/${orderId}/order-status`,
        {
          status,
          riderId: Number(riderId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order updated");

      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Order update failed");
    }
  };

  const markDelivered = async (deliveryId: number) => {
    try {
      await axios.patch(
        `${API}/delivery/${deliveryId}/delivered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order marked as delivered");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark delivered");
    }
  };

  const updateDeliveryStatus = async (deliveryId: number, status: string) => {
    try {
      await axios.patch(
        `${API}/delivery/${deliveryId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Delivery updated");

      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delivery update failed");
    }
  };

  // =========================================
  // LOGOUT
  // =========================================
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");

    window.location.href = "/login/rider";
  };

  // =========================================
  // STATS
  // =========================================
  // const totalDeliveries = orders.length;

  // const pendingOrders = orders.filter((o) => o.status !== "delivered").length;

  // const completedOrders = orders.filter((o) => o.status === "delivered").length;

  const totalDeliveries = deliveries.length;

  const pendingOrders = deliveries.filter(
    (d) => d.status === "accepted",
  ).length;

  const completedOrders = orders.filter((o) => o.status === "delivered").length;

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="bg-white px-10 py-6 rounded-3xl shadow-lg text-2xl font-bold">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Rider Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Welcome back <span className="font-bold">{rider?.name}</span> 👋
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/dashboard/rider/profile")}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-md"
        >
          View Profile
        </button>
      </div>

      <RiderStats
        totalDeliveries={totalDeliveries}
        pendingOrders={pendingOrders}
        completedOrders={completedOrders}
      />

      <RiderOrders
        deliveries={deliveries}
        updateDeliveryStatus={updateDeliveryStatus}
        markDelivered={markDelivered}
      />
      <RiderReviews reviews={reviews} />
    </div>
  );
};
export default RiderDashboard;
