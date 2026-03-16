import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  clearError,
} from "../redux/slices/cartSlice";

/**
 * Custom hook for cart operations
 * Provides all cart functionality with clean, easy-to-use interface
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error, addingItems } = useSelector(
    (state: RootState) => state.cart
  );

  const handleAddToCart = async (mealId: string, quantity: number = 1) => {
    return dispatch(addToCart({ mealId, quantity }));
  };

  const handleUpdateQuantity = async (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      return handleRemoveFromCart(mealId);
    }
    return dispatch(updateCartItem({ mealId, quantity }));
  };

  const handleRemoveFromCart = async (mealId: string) => {
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

  // Helper: Check if a meal is in cart
  const isInCart = (mealId: string) => {
    return cart?.items?.some((item) => item.meal._id === mealId) || false;
  };

  // Helper: Get quantity of specific meal in cart
  const getQuantity = (mealId: string) => {
    return cart?.items?.find((item) => item.meal._id === mealId)?.quantity || 0;
  };

  // Helper: Get specific item from cart
  const getCartItem = (mealId: string) => {
    return cart?.items?.find((item) => item.meal._id === mealId) || null;
  };

  return {
    // State
    cart,
    loading,
    error,
    addingItems,
    items: cart?.items || [],
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