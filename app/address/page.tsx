"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Star,
  Loader2,
  Home,
  User,
  Phone,
  MapPinned,
  ArrowLeft,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
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

interface FormData {
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  pincode: string;
  state: string;
}

const INITIAL_FORM: FormData = {
  recipientName: "",
  phoneNumber: "",
  fullAddress: "",
  city: "",
  pincode: "",
  state: "Madhya Pradesh",
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

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
    setFormData(INITIAL_FORM);
    setSelectedLocation(null);
    setEditingAddress(null);
    setErrors({});
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
    setErrors({});
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
    } catch {
      toast.error("Failed to fetch address details");
    }
    setShowMap(false);
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.recipientName.trim()) newErrors.recipientName = "Name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone is required";
    else if (!/^[0-9]{10,12}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Enter 10–12 digit number";
    if (!formData.fullAddress.trim()) newErrors.fullAddress = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Enter 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
    setDeleteLoading(true);
    try {
      await api.delete(`/user/address/delete/${id}`);
      toast.success("Address deleted");
      setDeleteConfirmId(null);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
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

  const inputClass = (field: keyof FormData) =>
    `w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-200 ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-300 focus:border-orange-500"
    }`;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

          {/* ── Header ── */}
          <div className="mb-5 sm:mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-3 sm:mb-4 text-xs sm:text-sm transition"
            >
              <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
              Back to Cart
            </Link>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">My Addresses</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Manage your delivery addresses
                </p>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition active:scale-95 flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Add Address</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* ── Address list ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-sm text-gray-500">Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <MapPin className="w-14 h-14 sm:w-20 sm:h-20 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-600 font-semibold text-sm sm:text-lg mb-2">No addresses saved yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">Add a delivery address to get started</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition"
              >
                <Plus className="w-4 h-4" />
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-200 hover:shadow-md p-4 sm:p-6 ${
                    address.isDefault
                      ? "border-orange-300 shadow-sm"
                      : "border-gray-100 hover:border-orange-200"
                  }`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Home className="w-4 h-4 sm:w-6 sm:h-6 text-orange-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-lg truncate">
                            {address.recipientName}
                          </h3>
                          {address.isDefault && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                              <Star className="w-3 h-3" />
                              Default
                            </span>
                          )}
                        </div>

                        {/* Actions — desktop */}
                        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address._id)}
                              className="text-orange-600 hover:text-orange-700 text-xs font-medium px-2 py-1 hover:bg-orange-50 rounded-lg transition mr-1"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(address)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(address._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">{address.phoneNumber}</p>
                      </div>

                      {/* Address */}
                      <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                        {address.fullAddress}, {address.city}, {address.state} – {address.pincode}
                      </p>

                      {/* Actions — mobile */}
                      <div className="flex items-center gap-2 mt-3 sm:hidden">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address._id)}
                            className="text-orange-600 hover:text-orange-700 text-xs font-medium px-3 py-1.5 border border-orange-200 rounded-lg hover:bg-orange-50 transition"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex items-center gap-1 text-xs text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(address._id)}
                          className="flex items-center gap-1 text-xs text-red-500 px-3 py-1.5 border border-red-100 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════
            ADD / EDIT FORM MODAL
        ═══════════════════════════════════════ */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">

              {/* Modal header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl z-10">
                <h2 className="text-base sm:text-xl font-bold text-gray-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {/* Map Picker Button */}
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="w-full py-3 sm:py-4 border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-xl flex items-center justify-center gap-3 text-orange-600 hover:text-orange-700 transition-all font-semibold text-xs sm:text-sm mb-5 sm:mb-6 hover:bg-orange-50"
                >
                  <MapPinned className="w-4 h-4 sm:w-5 sm:h-5" />
                  Pick Location on Map
                  {selectedLocation && (
                    <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Selected
                    </span>
                  )}
                </button>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                  {/* Recipient Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      <User className="w-3.5 h-3.5" />
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => { setFormData({ ...formData, recipientName: e.target.value }); setErrors((p) => ({ ...p, recipientName: undefined })); }}
                      placeholder="Full name"
                      className={inputClass("recipientName")}
                    />
                    {errors.recipientName && (
                      <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => { setFormData({ ...formData, phoneNumber: e.target.value }); setErrors((p) => ({ ...p, phoneNumber: undefined })); }}
                      placeholder="10–12 digit mobile number"
                      className={inputClass("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Full Address *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.fullAddress}
                      onChange={(e) => { setFormData({ ...formData, fullAddress: e.target.value }); setErrors((p) => ({ ...p, fullAddress: undefined })); }}
                      placeholder="House no., Street, Locality"
                      className={`${inputClass("fullAddress")} resize-none`}
                    />
                    {errors.fullAddress && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullAddress}</p>
                    )}
                  </div>

                  {/* City + Pincode */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 block">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => { setFormData({ ...formData, city: e.target.value }); setErrors((p) => ({ ...p, city: undefined })); }}
                        placeholder="City"
                        className={inputClass("city")}
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 block">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => { setFormData({ ...formData, pincode: e.target.value }); setErrors((p) => ({ ...p, pincode: undefined })); }}
                        placeholder="6 digits"
                        className={inputClass("pincode")}
                      />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 block">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                    >
                      <option>Madhya Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Uttar Pradesh</option>
                      <option>Rajasthan</option>
                      <option>Gujarat</option>
                      <option>West Bengal</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); resetForm(); }}
                      className="flex-1 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-xs sm:text-sm hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white rounded-xl font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingAddress ? "Update Address" : "Save Address"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            DELETE CONFIRM MODAL
        ═══════════════════════════════════════ */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Delete Address?</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-5">
                This address will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Keep It
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</>
                  ) : (
                    <><Trash2 className="w-4 h-4" />Delete</>
                  )}
                </button>
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
    </ProtectedRoute>
  );
}