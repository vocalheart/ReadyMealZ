"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./slices/cartSlice";
import { RootState } from "../redux/store";

/**
 * CartLoader - Initialize cart data on app mount
 * Fetch cart for authenticated users
 * Place this in your root layout/app file
 */
export default function CartLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only fetch cart if user is logged in
    if (user) {
      dispatch(fetchCart() as any);
    }
  }, [user, dispatch]);

  return <>{children}</>;
}