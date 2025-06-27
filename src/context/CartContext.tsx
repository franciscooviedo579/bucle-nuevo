import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Dish } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Dish }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  cart: CartState;
  addItem: (dish: Dish) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.dish.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.dish.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
        return { items: updatedItems, total };
      }
      
      const newItems = [...state.items, { dish: action.payload, quantity: 1 }];
      const total = newItems.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
      return { items: newItems, total };
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.dish.id !== action.payload);
      const total = filteredItems.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
      return { items: filteredItems, total };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      
      const updatedItems = state.items.map(item =>
        item.dish.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = updatedItems.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
      return { items: updatedItems, total };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (dish: Dish) => {
    dispatch({ type: 'ADD_ITEM', payload: dish });
  };

  const removeItem = (dishId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: dishId });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: dishId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};