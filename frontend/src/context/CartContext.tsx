import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void; //void means nothing will be returned. we are only passing something in with this.
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // this code about children makes it available to all the routes in app.tsx
  const [cart, setCart] = useState<CartItem[]>([]);

  // ADD
  // used in DonatePage.tsx
  const addToCart = (item: CartItem) => {
    // Point of this, what if they already have the item in the cart?
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId); // checking to see if an item exists, we use this in the return if statement decision
      const updatedCart = prevCart.map(
        (
          c // building updated cart if the item does exist in the cart, used in return if statement decision
        ) =>
          c.bookId === item.bookId
            ? { ...c, quantity: c.quantity + item.quantity } // adding to the original amount if additional donation is made
            : c
      );

      return existingItem ? updatedCart : [...prevCart, item]; // if there is an existingItem, then call updatedCart (making new cart) Else, we use the previous cart.
    });
  };

  // REMOVE
  // used in CartPage.tsx
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId)); // When you click remove, this filters to only the projectIds that don't match what you clicked to remove
  };

  // CLEAR
  // eventually will be used once we implement checkout feature, this will then clear the cart
  const clearCart = () => {
    setCart(() => []);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }} // returning each one of the functions, as well as the 'cart' which holds an [] of CartItems (CartItem.ts)
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {      // useCart is the whole shabang, what is used in CartPage.tsx and DonatePage.tsx as an IMPORT. CartItem.ts is also imported into those pages.
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a Cartprovider');
  }
  return context;
};
