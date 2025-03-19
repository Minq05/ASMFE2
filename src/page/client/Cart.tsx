import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CartItem } from "../../type/type";

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:8000/orders?userId=${user.id}`);
        if (res.data.length > 0) {
          setCartItems(res.data[0].items);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
        toast.error("Không thể tải giỏ hàng.");
      }
    };

    fetchCart();
  }, [user]);

  const updateCart = async (updatedItems) => {
    if (!user) return;

    try {
      const res = await axios.get(`http://localhost:8000/orders?userId=${user.id}`);
      if (res.data.length > 0) {
        const order = res.data[0];
        order.items = updatedItems;
        await axios.put(`http://localhost:8000/orders/${order.id}`, order);
        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      toast.error("Không thể cập nhật giỏ hàng.");
    }
  };

  const handleIncrease = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updatedCart[index].total = updatedCart[index].quantity * updatedCart[index].price;
    updateCart(updatedCart);
  };

  const handleDecrease = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updatedCart[index].total = updatedCart[index].quantity * updatedCart[index].price;
      updateCart(updatedCart);
    } else {
      handleRemove(index);
    }
  };

  const handleRemove = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Giỏ Hàng</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng trống.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between p-4 border-b items-center">
                <span>{item.productName} - {item.volume} </span>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-gray-300 rounded-l hover:bg-gray-400"
                    onClick={() => handleDecrease(index)}
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-300 rounded-r hover:bg-gray-400"
                    onClick={() => handleIncrease(index)}
                  >
                    +
                  </button>
                </div>
                <span>{(item.price * item.quantity).toLocaleString()} VND</span>
                <button
                  className="text-red-500 hover:text-red-700 ml-4"
                  onClick={() => handleRemove(index)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mt-4">Tổng tiền: {totalPrice.toLocaleString()} VND</h3>
          <button
            onClick={() => navigate("/payment", { state: { cartItems, totalPrice } })}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg mr-2 hover:bg-orange-600 transition cursor-pointer"
          >
            Tiến hành thanh toán
          </button>
        </>
      )}
      <button onClick={() => navigate("/order-history")} className="mt-4 cursor-pointer bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
        Xem lịch sử đơn hàng
      </button>
    </div>
  );
}

export default Cart;
