"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, MapPin, Star, Loader2, Home, 
  User, Phone, MapPinned, Navigation 
} from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import ProtectedRoute from "../components/ProtectedRoute";
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface Address {
  _id: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  pincode: string;
  state: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    fullAddress: "",
    city: "",
    pincode: "",
    state: "Madhya Pradesh",
  });

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch Addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/user/address");
      setAddresses(data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      recipientName: "",
      phoneNumber: "",
      fullAddress: "",
      city: "",
      pincode: "",
      state: "Madhya Pradesh",
    });
    setSelectedLocation(null);
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      fullAddress: address.fullAddress,
      city: address.city,
      pincode: address.pincode,
      state: address.state,
    });
    setShowForm(true);
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        city: data.address?.city || data.address?.town || data.address?.village || prev.city,
        state: data.address?.state || prev.state,
        pincode: data.address?.postcode || prev.pincode,
        fullAddress: data.display_name.split(",").slice(0, 4).join(", "),
      }));

      toast.success("Location picked successfully!");
    } catch (err) {
      toast.error("Failed to fetch address details");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingAddress) {
        await api.put(`/user/address/update/${editingAddress._id}`, formData);
        toast.success("Address updated successfully");
      } else {
        await api.post("/user/address/create", formData);
        toast.success("Address added successfully");
      }

      setShowForm(false);
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/user/address/delete/${id}`);
      toast.success("Address deleted successfully");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/user/address/set-default/${id}`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to set default");
    }
  };

  return (
     <ProtectedRoute>
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-orange-500" />
            My Addresses
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>

        {/* Address List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <MapPin className="w-20 h-20 mx-auto text-gray-300" />
            <p className="text-gray-500 mt-4 text-lg">No addresses saved yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-5">
                    <div className="mt-1">
                      <Home className="w-7 h-7 text-orange-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-xl text-gray-900">
                          {address.recipientName}
                        </h3>
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full font-medium flex items-center gap-1">
                            <Star className="w-4 h-4" /> Default
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {address.phoneNumber}
                      </p>

                      <p className="text-gray-600 mt-3 leading-relaxed">
                        {address.fullAddress}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-3 hover:bg-gray-100 rounded-2xl transition"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="p-3 hover:bg-red-50 rounded-2xl transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-auto shadow-2xl">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Map Picker Button */}
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="w-full py-5 border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-3xl flex items-center justify-center gap-4 text-orange-600 hover:text-orange-700 transition-all font-semibold text-lg"
                  >
                    <MapPinned className="w-7 h-7" />
                    📍 Pick Location on Map
                  </button>

                  {/* Form Fields */}
                  <div className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" /> Recipient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-lg"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-lg"
                        placeholder="10 digit mobile number"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4" /> Full Address
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.fullAddress}
                        onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-y"
                        placeholder="House no., Street, Locality"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="flex-1 py-4 border border-gray-300 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold text-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {formLoading && <Loader2 className="w-6 h-6 animate-spin" />}
                      {editingAddress ? "Update Address" : "Save Address"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Map Modal */}
        {showMap && (
          <MapPicker
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowMap(false)}
            initialLocation={selectedLocation}
          />
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}