"use client";

import { useParams, useSearchParams } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
export default function TiffinDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const isSubscribe = searchParams.get("subscribe");
  // convert to boolean
  const subscribe = isSubscribe === "true";
  return (
    <ProtectedRoute>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tiffin Details</h1>
      <p className="mt-2 text-gray-600">ID: {id}</p>
      {/* Condition based UI */}
      {subscribe ? (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">
            You are in Subscription Mode 
          </p>
          <button className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600">
            Continue to Payment
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
          <p className="text-gray-700">
            Normal Detail View (No subscription selected)
          </p>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}