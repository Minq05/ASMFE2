import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:8000/orders?userId=${user.id}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
        toast.error("Không thể tải lịch sử đơn hàng.");
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index} className="p-4 border-b">
              <h3 className="text-lg font-semibold">Đơn hàng #{order.id} - {new Date(order.createdAt).toLocaleString()}</h3>
              <ul className="ml-4">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.productName} (x{item.quantity})</span>
                    <span>{(item.price * item.quantity).toLocaleString()} VND</span>
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">Tổng tiền: {order.totalPrice.toLocaleString()} VND</p>
              <p className="text-green-500">Trạng thái: {order.status}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/cart")} className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
        Quay lại giỏ hàng
      </button>
    </div>
  );
}

export default OrderHistory;
