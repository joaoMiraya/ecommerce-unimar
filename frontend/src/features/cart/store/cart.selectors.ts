import type { RootState } from "../../../store/root_reducer";


export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity, 0
    );

export const selectCartCount = (state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectIsInCart = (productId: string) => (state: RootState) =>
    state.cart.items.some(item => item.product.id === productId);