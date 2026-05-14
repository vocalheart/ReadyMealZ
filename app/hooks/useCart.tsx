import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  clearError,
} from "../redux/slices/Cartslice";

/**
 * Custom hook for cart operations
 * Provides all cart functionality with clean, easy-to-use interface
 */
export const useCart = () => {
  const dispatch = useDispatch();

  const { cart, loading, error, addingItems } = useSelector(
    (state: RootState) => state.cart
  );

  // ─────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────

  const handleAddToCart = async (
    mealId: string,
    quantity: number = 1
  ) => {
    if (!mealId) return;

    return dispatch(addToCart({ mealId, quantity }));
  };

  const handleUpdateQuantity = async (
    mealId: string,
    quantity: number
  ) => {
    if (!mealId) return;

    if (quantity <= 0) {
      return handleRemoveFromCart(mealId);
    }

    return dispatch(updateCartItem({ mealId, quantity }));
  };

  const handleRemoveFromCart = async (mealId: string) => {
    if (!mealId) return;

    return dispatch(removeFromCart({ mealId }));
  };

  const handleClearCart = async () => {
    return dispatch(clearCart());
  };

  const handleFetchCart = async () => {
    return dispatch(fetchCart());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // ─────────────────────────────────────────────
  // Safe Cart Items
  // Filters broken/null meals
  // ─────────────────────────────────────────────

  const safeItems =
    cart?.items?.filter(
      (item) => item && item.meal && item.meal._id
    ) || [];

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  // Check if meal exists in cart
  const isInCart = (mealId: string) => {
    if (!mealId) return false;

    return (
      safeItems.some(
        (item) => item?.meal?._id === mealId
      ) || false
    );
  };

  // Get quantity of a meal
  const getQuantity = (mealId: string) => {
    if (!mealId) return 0;

    return (
      safeItems.find(
        (item) => item?.meal?._id === mealId
      )?.quantity || 0
    );
  };

  // Get full cart item
  const getCartItem = (mealId: string) => {
    if (!mealId) return null;

    return (
      safeItems.find(
        (item) => item?.meal?._id === mealId
      ) || null
    );
  };

  return {
    // State
    cart,
    loading,
    error,
    addingItems,

    // Safe filtered items
    items: safeItems,

    total: cart?.cartTotal || 0,
    itemCount: cart?.totalItems || 0,

    // Actions
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    fetchCart: handleFetchCart,
    clearError: handleClearError,

    // Helpers
    isInCart,
    getQuantity,
    getCartItem,
  };
};