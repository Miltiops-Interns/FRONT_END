import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

// Types
/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique id for the menu item
 * @property {string} name - Item display name
 * @property {number} price - Unit price as number
 * @property {string | undefined} image - Optional image URL
 * @property {number} quantity - Quantity in cart
 */

const CartContext = createContext(null);

const STORAGE_KEY = "restaurant_cart_v1";

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      return action.payload;
    }
    case "ADD_ITEM": {
      const incoming = action.payload; // { id, name, price, image }
      const existingIndex = state.items.findIndex((i) => i.id === incoming.id);
      if (existingIndex !== -1) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: incoming.id,
            name: incoming.name,
            price: Number(incoming.price) || 0,
            image: incoming.image,
            quantity: 1,
          },
        ],
      };
    }
    case "REMOVE_ITEM": {
      const id = action.payload;
      return { ...state, items: state.items.filter((i) => i.id !== id) };
    }
    case "UPDATE_QTY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Persist on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // ignore
    }
  }, [state]);

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );
  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0
      ),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      totalItems,
      totalPrice,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
