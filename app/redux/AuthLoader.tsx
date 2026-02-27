"use client";
import { useEffect } from "react";
import api from "../lib/axios";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "./slices/authSlice";

export default function AuthLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));

        const res = await api.get("/user/me", {
          withCredentials: true, //  cookie auth
        });

        if (res.data?.success) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        dispatch(setUser(null));
      }
    };

    fetchUser();
  }, [dispatch]);

  return <>{children}</>;
}