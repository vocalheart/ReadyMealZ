import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/axios";

/* ─── Types ─────────────────────────────────── */
interface CartItem {
  meal: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    images?: Array<{ url: string; key: string }>;
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  cartTotal: number;
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addingItems: Record<string, boolean>; // Track loading state per meal
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  addingItems: {},
};

/* ─── Async Thunks ─────────────────────────────── */

/**
 * Fetch cart for current user
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/cart", { withCredentials: true });
      if (res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

/**
 * Add meal to cart
 */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { mealId, quantity = 1 }: { mealId: string; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(
        "/cart/add",
        { mealId, quantity },
        { withCredentials: true }
      );
      if (res.data.success) {
        return res.data.data.cart;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

/**
 * Update cart item quantity
 */
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { mealId, quantity }: { mealId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        "/cart/update",
        { mealId, quantity },
        { withCredentials: true }
      );
      if (res.data.success) {
        return res.data.data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

/**
 * Remove item from cart
 */
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ mealId }: { mealId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete("/cart/remove", {
        data: { mealId },
        withCredentials: true,
      });
      if (res.data.success) {
        return res.data.data.cart;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from cart"
      );
    }
  }
);

/**
 * Clear entire cart
 */
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete("/cart/clear", { withCredentials: true });
      if (res.data.success) {
        return res.data.data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

/* ─── Slice ─────────────────────────────────── */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Sync actions
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
      state.addingItems = {};
    },
  },
  extraReducers: (builder) => {
    /* ── Fetch Cart ── */
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || {
          items: [],
          cartTotal: 0,
          totalItems: 0,
        };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* ── Add to Cart ── */
    builder
      .addCase(addToCart.pending, (state, action) => {
        const mealId = (action.meta.arg as { mealId: string }).mealId;
        state.addingItems[mealId] = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const mealId = (action.meta.arg as { mealId: string }).mealId;
        state.addingItems[mealId] = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        const mealId = (action.meta.arg as { mealId: string }).mealId;
        state.addingItems[mealId] = false;
        state.error = action.payload as string;
      });

    /* ── Update Cart Item ── */
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* ── Remove from Cart ── */
    builder
      .addCase(removeFromCart.pending, (state, action) => {
        const mealId = (action.meta.arg as { mealId: string }).mealId;
        state.addingItems[mealId] = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const mealId = (action.meta.arg as { mealId: string }).mealId;
        state.addingItems[mealId] = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        const mealId = (action.meta.arg as { mealId: string }).mealId;
        state.addingItems[mealId] = false;
        state.error = action.payload as string;
      });

    /* ── Clear Cart ── */
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;