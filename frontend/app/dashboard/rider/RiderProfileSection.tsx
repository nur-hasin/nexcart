import React from "react";

interface RiderProfileData {
  rider: any;
  previewImage: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRider: React.Dispatch<React.SetStateAction<any>>;
  updateProfile: () => Promise<void>;
  changeStatus: (status: string) => Promise<void>;
  deleteProfile: () => Promise<void>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isChangingPassword: boolean;
  setIsChangingPassword: React.Dispatch<React.SetStateAction<boolean>>;
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >;
  changePassword: () => Promise<void>;
}

const RiderProfileSection = ({
  rider,
  previewImage,
  handleImageChange,
  setRider,
  updateProfile,
  changeStatus,
  deleteProfile,
  isEditing,
  setIsEditing,
  isChangingPassword,
  setIsChangingPassword,
  passwordForm,
  setPasswordForm,
  changePassword,
}: RiderProfileData) => {
  if (!isEditing) {
    // Read-only view
    return (
      <div className="bg-white rounded-[32px] shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative">
            <img
              src={previewImage ? previewImage : "https://via.placeholder.com/150"}
              alt="profile"
              className="w-36 h-36 rounded-full object-cover border-[5px] border-blue-100 shadow-lg"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900">{rider?.name}</h2>
            <p className="text-slate-500 mt-2 text-lg">{rider?.email}</p>
            <p className="text-slate-600 mt-2">Phone: {rider?.phone}</p>
            <p className="text-slate-600 mt-1">Vehicle: {rider?.vehicle_type}</p>
            <p className="text-slate-600 mt-1">Location: {rider?.current_location}</p>

            <div className="flex flex-wrap gap-3 mt-5">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {rider?.vehicle_type}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                  rider?.status === "available"
                    ? "bg-green-100 text-green-700"
                    : rider?.status === "busy"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rider?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-bold text-xl mb-4">Availability Status</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => changeStatus("available")}
              className={`px-6 py-3 rounded-2xl text-white font-semibold transition ${
                rider?.status === "available" ? "bg-green-600" : "bg-slate-400"
              }`}
            >
              Available
            </button>
            <button
              onClick={() => changeStatus("busy")}
              className={`px-6 py-3 rounded-2xl text-white font-semibold transition ${
                rider?.status === "busy" ? "bg-yellow-500" : "bg-slate-400"
              }`}
            >
              Busy
            </button>
            <button
              onClick={() => changeStatus("offline")}
              className={`px-6 py-3 rounded-2xl text-white font-semibold transition ${
                rider?.status === "offline" ? "bg-red-500" : "bg-slate-400"
              }`}
            >
              Offline
            </button>
          </div>
        </div>

        <div className="mt-10 bg-slate-50 p-5 rounded-3xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-xl">Change Password</h3>
              <p className="text-slate-500 text-sm">Update your password securely from your rider account.</p>
            </div>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
            >
              {isChangingPassword ? 'Close Password Form' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword && (
            <div className="grid gap-4">
              <div>
                <label className="block mb-2 font-semibold text-slate-700">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={changePassword}
                className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-md"
              >
                Save New Password
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={deleteProfile}
            className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-md"
          >
            Delete Profile
          </button>
        </div>
      </div>
    );
  }

  // Edit view
  return (
    <div className="bg-white rounded-[32px] shadow-xl p-8 border border-slate-100">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="relative">
          <img
            src={previewImage ? previewImage : "https://via.placeholder.com/150"}
            alt="profile"
            className="w-36 h-36 rounded-full object-cover border-[5px] border-blue-100 shadow-lg"
          />

          <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-full cursor-pointer shadow-lg transition">
            Change
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900">{rider?.name}</h2>
          <p className="text-slate-500 mt-2 text-lg">{rider?.email}</p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
              {rider?.vehicle_type}
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                rider?.status === "available"
                  ? "bg-green-100 text-green-700"
                  : rider?.status === "busy"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {rider?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold text-slate-700">Full Name</label>
          <input
            type="text"
            value={rider?.name || ""}
            onChange={(e) => setRider({ ...rider, name: e.target.value })}
            className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-slate-700">Phone Number</label>
          <input
            type="text"
            value={rider?.phone || ""}
            onChange={(e) => setRider({ ...rider, phone: e.target.value })}
            className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-slate-700">Email Address</label>
          <input
            disabled
            value={rider?.email || ""}
            className="w-full border border-slate-200 bg-slate-100 p-4 rounded-2xl"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-slate-700">Vehicle Type</label>
          <select
            value={rider?.vehicle_type || ""}
            onChange={(e) => setRider({ ...rider, vehicle_type: e.target.value })}
            className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Vehicle</option>
            <option value="bike">Bike</option>
            <option value="car">Car</option>
            <option value="scooter">Scooter</option>
            <option value="bicycle">Bicycle</option>
            <option value="truck">Truck</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-slate-700">Current Location</label>
          <input
            type="text"
            value={rider?.current_location || ""}
            onChange={(e) => setRider({ ...rider, current_location: e.target.value })}
            className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-bold text-xl mb-4">Availability Status</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => changeStatus("available")}
            className={`px-6 py-3 rounded-2xl text-white font-semibold transition ${
              rider?.status === "available" ? "bg-green-600" : "bg-slate-400"
            }`}
          >
            Available
          </button>
          <button
            onClick={() => changeStatus("busy")}
            className={`px-6 py-3 rounded-2xl text-white font-semibold transition ${
              rider?.status === "busy" ? "bg-yellow-500" : "bg-slate-400"
            }`}
          >
            Busy
          </button>
          <button
            onClick={() => changeStatus("offline")}
            className={`px-6 py-3 rounded-2xl text-white font-semibold transition ${
              rider?.status === "offline" ? "bg-red-500" : "bg-slate-400"
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      <div className="mt-10 bg-slate-50 p-5 rounded-3xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-xl">Change Password</h3>
            <p className="text-slate-500 text-sm">Update your password securely from your rider account.</p>
          </div>
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
          >
            {isChangingPassword ? 'Close Password Form' : 'Change Password'}
          </button>
        </div>

        {isChangingPassword && (
          <div className="grid gap-4">
            <div>
              <label className="block mb-2 font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-slate-700">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={changePassword}
              className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-md"
            >
              Save New Password
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-10">
        <button
          onClick={updateProfile}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
        >
          Save Profile Changes
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="bg-gray-500 hover:bg-gray-600 transition text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
        >
          Cancel
        </button>
        <button
          onClick={deleteProfile}
          className="bg-red-600 hover:bg-red-700 transition text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default RiderProfileSection;
