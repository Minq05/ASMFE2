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
  addToCart: (item: CartItem) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const addToCart = async (item: CartItem) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    try {
      const res = await API.get(`orders?userId=${user.id}`);
      const orders = Array.isArray(res.data) ? res.data : [];
      let order = orders[0];

      if (order) {
        const existingItemIndex = order.items.findIndex(
          (i: CartItem) =>
            i.productId === item.productId && i.volume === item.volume
        );

        if (existingItemIndex !== -1) {
          order.items[existingItemIndex].quantity += item.quantity;
          order.items[existingItemIndex].total =
            order.items[existingItemIndex].quantity *
            order.items[existingItemIndex].price;
        } else {
          order.items.push(item);
        }

        await API.put(`orders/${order.id}`, order);
        setCartItems(order.items);
      } else {
        const newOrder = {
          userId: user.id,
          items: [item],
        };
        const res = await API.post(`orders`, newOrder);
        setCartItems(res.data.items);
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCart, cartQuantity }}
    >
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
