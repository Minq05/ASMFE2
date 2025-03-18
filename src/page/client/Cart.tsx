import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Order } from "../../type/type";

function Cart() {
  const [carts, setCarts] = useState<Order[]>([]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/orders");
      setCarts(data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi hiển thị giỏ hàng");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const cartItem = carts.find((item) => item.id === id);
      if (!cartItem) return;
      const updatedItem = { ...cartItem, quantity: newQuantity, total: newQuantity * cartItem.price };
      await axios.put(`http://localhost:3000/orders/${id}`, updatedItem);
      fetchCart();
    } catch (error) {
      console.log(error);

      toast.error("Lỗi khi cập nhật số lượng");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await axios.delete(`http://localhost:3000/orders/${id}`);
        fetchCart();
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi xoá sản phẩm");
      }
    }
  };

  const totalPrice = carts.reduce((acc, item) => acc + item.total, 0);

  return (
    <main className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>

      {carts.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {carts.map((cart) => (
            <div key={cart.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold">{cart.productName}</h3>
                  <p className="text-gray-600">Số lượng: {cart.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-orange-600">
                  {(cart.price * cart.quantity).toLocaleString()}đ
                </span>
                <input
                  type="number"
                  value={cart.quantity}
                  onChange={(e) =>
                    handleQuantityChange(cart.id, parseInt(e.target.value))
                  }
                  className="w-16 border rounded-lg text-center"
                />
                <button
                  onClick={() => handleDeleteItem(cart.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold">
              Tổng tiền:{" "}
              <span className="text-orange-600">{totalPrice.toLocaleString()}đ</span>
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <a href="/payment">
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
                Thanh toán
              </button>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
