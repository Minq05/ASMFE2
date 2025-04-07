import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

export interface CartItem {
  productId: string;
  productName: string;
  volume: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  updateCart: (updatedItems: CartItem[]) => Promise<void>;
  cartQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        try {
          const res = await API.get(`orders?userId=${user.id}`);
          if (res.data.length > 0) {
            setCartItems(res.data[0].items);
          }
        } catch (error) {
          console.error("Lỗi lấy giỏ hàng:", error);
        }
      }
    };
    fetchCart();
  }, []);

  const updateCart = async (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    try {
      const res = await API.get(`orders?userId=${user.id}`);
      if (res.data.length > 0) {
        const order = res.data[0];
        order.items = updatedItems;
        await API.put(`orders/${order.id}`, order);
      }
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
    }
  };
  const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, updateCart, cartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng trong CartProvider");
  }
  return context;
};
